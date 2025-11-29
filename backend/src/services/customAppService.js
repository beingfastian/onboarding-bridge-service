// Custom App API integration service
const customAppClient = require('../config/customAppClient');
const prisma = require('../config/db');

const MOCK_MODE = process.env.MOCK_CUSTOM_APP === 'true';

/**
 * Check if user already provisioned in Custom App
 * @param {string} email - User email
 * @returns {object|null} - User record or null
 */
const checkDuplicate = async (email) => {
  try {
    const user = await prisma.provisionedUser.findUnique({
      where: { email },
    });
    return user;
  } catch (error) {
    console.error('Error checking duplicate:', error.message);
    throw new Error(`Duplicate check failed: ${error.message}`);
  }
};

/**
 * Provision user in Custom App
 * @param {object} userData - { name, email, phone, ghlContactId }
 * @returns {object} - Response from Custom App
 */
const provisionUserInCustomApp = async (userData) => {
  try {
    const payload = {
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      ghlContactId: userData.ghlContactId,
    };

    console.log('Provisioning user in Custom App:', userData.email);
    const response = await customAppClient.post('/api/v1/provision-user', payload);

    return response.data;
  } catch (error) {
    console.error('Error provisioning user in Custom App:', error.message);
    throw new Error(`Custom App provisioning failed: ${error.message}`);
  }
};

/**
 * Save provisioned user to database
 * @param {object} userData - User data to save
 * @returns {object} - Saved record
 */
const saveProvisionedUser = async (userData) => {
  try {
    const record = await prisma.provisionedUser.create({
      data: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        ghlContactId: userData.ghlContactId,
        customAppId: userData.customAppId || null,
      },
    });

    console.log('Saved provisioned user to DB:', record.email);
    return record;
  } catch (error) {
    console.error('Error saving provisioned user:', error.message);
    throw new Error(`Failed to save user record: ${error.message}`);
  }
};

/**
 * Main function: Handle complete provisioning workflow
 * @param {object} userData - { firstName, lastName, email, phone, ghlContactId }
 * @returns {object} - Provisioning result
 */
const provisionUser = async (userData) => {
  try {
    if (MOCK_MODE) {
      // Simulate Custom App provisioning
      console.log(`[MOCK CUSTOM_APP] Provisioning user: ${userData.email}`);
      
      // Check duplicate using actual database
      const existingUser = await checkDuplicate(userData.email);
      if (existingUser) {
        return {
          status: 'already_provisioned',
          message: 'User already exists in our system',
          data: existingUser,
        };
      }

      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Save to database (real)
      const mockAppId = `app_mock_${Date.now()}`;
      const dbRecord = await saveProvisionedUser({
        ...userData,
        customAppId: mockAppId,
      });

      return {
        status: 'success',
        message: 'User successfully provisioned',
        data: dbRecord,
      };
    }

    // Step 1: Check for duplicate
    const existingUser = await checkDuplicate(userData.email);
    if (existingUser) {
      console.log(`User already provisioned: ${userData.email}`);
      return {
        status: 'already_provisioned',
        message: 'User already exists in our system',
        data: existingUser,
      };
    }

    // Step 2: Provision in Custom App
    const fullName = `${userData.firstName} ${userData.lastName}`;
    const customAppResponse = await provisionUserInCustomApp({
      name: fullName,
      email: userData.email,
      phone: userData.phone,
      ghlContactId: userData.ghlContactId,
    });

    // Step 3: Save to database
    const dbRecord = await saveProvisionedUser({
      ...userData,
      customAppId: customAppResponse?.userId || customAppResponse?.id,
    });

    return {
      status: 'success',
      message: 'User successfully provisioned',
      data: dbRecord,
    };
  } catch (error) {
    throw new Error(`Provisioning workflow failed: ${error.message}`);
  }
};

module.exports = {
  checkDuplicate,
  provisionUserInCustomApp,
  saveProvisionedUser,
  provisionUser,
};
