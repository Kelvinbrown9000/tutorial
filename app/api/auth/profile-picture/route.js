import { connectDB } from '@/lib/mongodb';
import { withAuth } from '@/lib/apiMiddleware';
import User from '@/models/User';
import mongoose from 'mongoose';

export const PATCH = withAuth(async function (request, _context, jwtPayload) {
  try {
    await connectDB();
    const { profilePicture } = await request.json();

    if (profilePicture !== null && profilePicture !== undefined) {
      if (!profilePicture.match(/^data:image\/(jpeg|jpg|png|gif|webp);base64,/)) {
        return Response.json({ error: 'Invalid image format. Use JPEG, PNG, GIF, or WebP.' }, { status: 400 });
      }
      // ~2MB limit (base64 is ~33% larger than raw)
      if (profilePicture.length > 2_800_000) {
        return Response.json({ error: 'Image is too large. Maximum size is 2MB.' }, { status: 400 });
      }
    }

    // Use the raw collection driver so the update is never stripped by
    // Mongoose schema strict mode (avoids model-cache issues in dev).
    await User.collection.updateOne(
      { _id: new mongoose.Types.ObjectId(jwtPayload.userId) },
      { $set: { profilePicture: profilePicture ?? null } }
    );

    return Response.json({ ok: true });
  } catch (err) {
    console.error('Profile picture error:', err);
    return Response.json({ error: 'Failed to update profile picture' }, { status: 500 });
  }
});
