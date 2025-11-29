// GoHighLevel API integration service
const ghlClient = require('../config/ghlClient');

// Add this at the top to enable mock mode
const MOCK_MODE = process.env.MOCK_GHL === 'true';

/**
 * Search contact by email in GHL
 * @param {string} email - Contact email
 * @returns {object|null} - Contact object or null
 */
const searchContactByEmail = async (email) => {
  try {
    // GHL v2 API endpoint to search contacts
    const response = await ghlClient.get(`/v2/contacts/search`, {
      params: {
        locationId: process.env.GHL_LOCATION_ID,
        query: email,
      },
    });

    const contacts = response.data?.contacts || [];
    
    // Find exact email match
    return contacts.find((c) => c.email?.toLowerCase() === email.toLowerCase()) || null;
  } catch (error) {
    console.error('Error searching contact in GHL:', error.message);
    throw new Error(`GHL search failed: ${error.message}`);
  }
};

/**
 * Create a new contact in GHL
 * @param {object} contactData - { firstName, lastName, email, phone }
 * @returns {object} - Created contact with id
 */
const createContact = async (contactData) => {
  try {
    const payload = {
      firstName: contactData.firstName,
      lastName: contactData.lastName,
      email: contactData.email,
      phone: contactData.phone,
      locationId: process.env.GHL_LOCATION_ID,
      tags: contactData.tags || [],
    };

    const response = await ghlClient.post(`/v2/contacts/`, payload);

    if (!response.data?.contact?.id) {
      throw new Error('No contact ID returned from GHL');
    }

    return response.data.contact;
  } catch (error) {
    console.error('Error creating contact in GHL:', error.message);
    throw new Error(`GHL contact creation failed: ${error.message}`);
  }
};

/**
 * Update existing contact in GHL
 * @param {string} contactId - GHL contact ID
 * @param {object} updateData - Data to update
 * @returns {object} - Updated contact
 */
const updateContact = async (contactId, updateData) => {
  try {
    const payload = {
      firstName: updateData.firstName,
      lastName: updateData.lastName,
      phone: updateData.phone,
      tags: updateData.tags || [],
    };

    const response = await ghlClient.put(
      `/v2/contacts/${contactId}`,
      payload
    );

    return response.data.contact;
  } catch (error) {
    console.error('Error updating contact in GHL:', error.message);
    throw new Error(`GHL contact update failed: ${error.message}`);
  }
};

/**
 * Main function: Sync contact with GHL (create or update)
 * @param {object} contactData - { firstName, lastName, email, phone, tags }
 * @returns {object} - { ghlContactId, isNew }
 */
const syncContactWithGHL = async (contactData) => {
  try {
    if (MOCK_MODE) {
      // Simulate GHL API behavior
      console.log(`[MOCK GHL] Syncing contact: ${contactData.email}`);
      
      const mockContactId = `contact_mock_${Date.now()}`;
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        ghlContactId: mockContactId,
        isNew: true,
      };
    }

    // Step 1: Search for existing contact
    const existingContact = await searchContactByEmail(contactData.email);

    if (existingContact) {
      // Update existing contact
      console.log(`Updating existing GHL contact: ${existingContact.id}`);
      await updateContact(existingContact.id, contactData);
      return {
        ghlContactId: existingContact.id,
        isNew: false,
      };
    } else {
      // Create new contact
      console.log(`Creating new GHL contact for: ${contactData.email}`);
      const newContact = await createContact(contactData);
      return {
        ghlContactId: newContact.id,
        isNew: true,
      };
    }
  } catch (error) {
    throw new Error(`GHL sync failed: ${error.message}`);
  }
};

module.exports = {
  searchContactByEmail,
  createContact,
  updateContact,
  syncContactWithGHL,
};
