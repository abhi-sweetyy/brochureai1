// After creating the copy of the presentation, add:
// Set permissions to allow anyone with the link to edit
await drive.permissions.create({
  fileId: createdDoc.id,
  requestBody: {
    role: req.body.shareSettings?.role || 'writer',
    type: req.body.shareSettings?.type || 'anyone',
  },
}); 