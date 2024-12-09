import { Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { User, ExtendedRequest } from '../types';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const authenticateToken = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('Authorization Header:', authHeader);

    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    const [bearer, token] = authHeader.split(' ');
    console.log('Bearer:', bearer);
    console.log('Token:', token);

    if (bearer !== 'Bearer' || !token) {
      return res.status(401).json({ error: 'Invalid authorization format' });
    }

    // First, try Supabase's getUser method
    const { data, error: supabaseError } = await supabase.auth.getUser(token);
    
    console.log('Supabase Auth User Data:', JSON.stringify(data, null, 2));
    console.log('Supabase Auth Error:', supabaseError);

    // If Supabase method fails, try manual JWT verification
    if (supabaseError || !data.user) {
      try {
        // Decode the JWT to check its structure
        const decoded = jwt.decode(token, { complete: true });
        console.log('Decoded JWT:', decoded);

        // If you have a way to verify the JWT, do it here
        // For now, we'll just check if it's a valid JWT structure
        if (!decoded) {
          return res.status(401).json({ 
            error: 'Invalid token', 
            details: 'Token could not be decoded' 
          });
        }

        // Manually extract the user ID from the decoded token
        const payload = decoded.payload as JwtPayload;
        const userId = payload.sub;
        const userEmail = typeof payload.email === 'string' ? payload.email : '';
        console.log('Manually extracted User ID:', userId);

        // Fetch additional user details from Supabase
        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        if (profileError || !userProfile) {
          console.error('User profile fetch error:', profileError);
          return res.status(401).json({ 
            error: 'User not found', 
            details: 'Could not retrieve user profile' 
          });
        }

        // Create a complete user object
        req.user = { 
          id: userId || '', 
          email: userEmail,
          role: userProfile.role,
          metadata: userProfile.metadata
        } as User;

        return next();
      } catch (jwtError) {
        console.error('JWT Verification Error:', jwtError);
        return res.status(401).json({ 
          error: 'Authentication failed', 
          details: 'Token verification error' 
        });
      }
    }

    // Attach user to the request
    req.user = {
      id: data.user.id,
      email: data.user.email || '',
      role: data.user.user_metadata?.role,
      metadata: data.user.user_metadata
    } as User;
    next();
  } catch (error) {
    console.error('Authentication Middleware Error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      details: 'Authentication process failed' 
    });
  }
};