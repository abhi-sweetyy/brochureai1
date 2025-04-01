import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { documentId } = body;

    if (!documentId) {
      return NextResponse.json({ message: 'Document ID is required' }, { status: 400 });
    }

    // Set up authentication with your service account
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/presentations',
      ],
    });

    const drive = google.drive({ version: 'v3', auth });

    // First, check if the permissions are already set
    const permissionsList = await drive.permissions.list({
      fileId: documentId,
      fields: 'permissions(id,role,type)',
    });

    // Check if 'anyone' with 'writer' role exists
    const anyoneWriterExists = permissionsList.data.permissions?.some(
      p => p.type === 'anyone' && p.role === 'writer'
    );

    if (!anyoneWriterExists) {
      // Create the permission
      await drive.permissions.create({
        fileId: documentId,
        requestBody: {
          role: 'writer',
          type: 'anyone',
        },
        fields: 'id',
      });
    }

    // Ensure the document is published to the web
    await drive.revisions.update({
      fileId: documentId,
      revisionId: '1',
      requestBody: {
        published: true,
        publishAuto: true,
        publishedOutsideDomain: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error setting document permissions:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to set document permissions' },
      { status: 500 }
    );
  }
} 