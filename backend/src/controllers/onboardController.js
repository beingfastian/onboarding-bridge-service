// Onboarding controller - Main entry point for onboarding requests
const { sendSuccess, sendError } = require('../utils/response');
const { validateOnboardingPayload } = require('../services/validationService');
const { syncContactWithGHL } = require('../services/ghlService');
const { provisionUser } = require('../services/customAppService');

/**
 * POST /api/onboard
 * Main onboarding endpoint
 * Flow:
 *   1. Validate payload (email, phone, required fields)
 *   2. Sync with GHL (create or update contact)
 *   3. Provision user in Custom App
 *   4. Return success/error response
 */
const onboard = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, tags } = req.body;

    // Step 1: Validate input
    const validation = validateOnboardingPayload({
      firstName,
      lastName,
      email,
      phone,
    });

    if (!validation.isValid) {
      return sendError(
        res,
        'Validation failed',
        400,
        validation.errors
      );
    }

    console.log(`\n[ONBOARD] Starting onboarding for: ${email}`);

    // Step 2: Sync with GHL
    console.log('[GHL] Syncing contact...');
    const ghlResult = await syncContactWithGHL({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      tags: tags || [],
    });

    console.log(`[GHL] Contact synced. ID: ${ghlResult.ghlContactId}`);

    // Step 3: Provision in Custom App
    console.log('[CUSTOM_APP] Provisioning user...');
    const provisionResult = await provisionUser({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      ghlContactId: ghlResult.ghlContactId,
    });

    console.log('[CUSTOM_APP] User provisioned successfully');

    // Step 4: Return success
    return sendSuccess(
      res,
      {
        ghlContactId: ghlResult.ghlContactId,
        provisioningStatus: provisionResult.status,
        user: provisionResult.data,
      },
      'Onboarding completed successfully',
      201
    );
  } catch (error) {
    console.error('[ERROR] Onboarding failed:', error.message);

    // Determine appropriate error message and status code
    let statusCode = 500;
    let message = 'Onboarding failed';

    if (error.message.includes('GHL')) {
      statusCode = 502;
      message = 'GHL integration failed. Please try again later.';
    } else if (error.message.includes('Custom App')) {
      statusCode = 502;
      message = 'Custom App provisioning failed. Please try again later.';
    }

    return sendError(res, message, statusCode, error.message);
  }
};

module.exports = {
  onboard,
};
