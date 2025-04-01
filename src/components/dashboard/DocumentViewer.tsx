// Update the presentationId to your Google Slides URL
const PRESENTATION_ID = '163ORTnlGT7GSowNSbYzS6pbgANpsLfTrmuzTMPd-Now';

const processDocument = async () => {
  setLoading(true);
  try {
    // Make sure we have the current placeholder values
    const currentPlaceholders = {
      phone_number: placeholders.phone_number || '',
      email_address: placeholders.email_address || '',
      website_name: placeholders.website_name || '',
      title: placeholders.title || '',
      address: placeholders.address || '',
      shortdescription: placeholders.shortdescription || '',
      price: placeholders.price || '',
      date_available: placeholders.date_available || '',
      name_brokerfirm: placeholders.name_brokerfirm || '',
      descriptionlarge: placeholders.descriptionlarge || '',
      descriptionextralarge: placeholders.descriptionextralarge || '',
      address_brokerfirm: placeholders.address_brokerfirm || ''
    };

    console.log("Processing document with placeholders:", currentPlaceholders);
    
    // Call the API with all 12 placeholders
    const response = await fetch('/api/process-document', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        presentationId: PRESENTATION_ID,
        placeholders: currentPlaceholders
      }),
    });

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();
    setDocumentUrl(data.viewUrl);
    setEditUrl(data.editUrl);
    setError(null);
  } catch (err) {
    console.error('Error processing document:', err);
    setError(`Failed to process document: ${err.message}`);
  } finally {
    setLoading(false);
  }
}; 