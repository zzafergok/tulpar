import { NextResponse } from 'next/server';
import { z } from 'zod';
import { withApiRoute } from '@/lib/api/server';
import { signUpWithFirebasePassword } from '@/lib/auth/firebase-identity';
import { signToken } from '@/lib/auth/jwt';
import { createSession } from '@/lib/auth/session';

const registerSchema = z.object({
  email: z.string().trim().email('Geçerli bir e-posta adresi giriniz.'),
  password: z.string().min(8, 'Şifre en az 8 karakter olmalıdır.'),
  name: z.string().trim().min(1).max(80).optional(),
});

export const POST = withApiRoute({
  rateLimitPolicy: 'auth_register',
  bodySchema: registerSchema,
  handler: async ({ body }) => {
    const { email, password, name } = body;
    const identity = await signUpWithFirebasePassword(email, password, name);
    if (!identity) {
      return NextResponse.json(
        { message: 'Kayıt oluşturulamadı. E-posta zaten kullanımda olabilir.' },
        { status: 409 },
      );
    }

    const displayName = identity.displayName || email.split('@')[0];
    const token = signToken({
      sub: identity.uid,
      email: identity.email,
      name: displayName,
      role: 'user',
    });

    await createSession(token);

    return NextResponse.json(
      {
        message: 'Kayıt başarılı',
        token,
        user: {
          id: identity.uid,
          email: identity.email,
          name: displayName,
          role: 'user',
        },
      },
      { status: 201 },
    );
  },
});
