# Single Sign-On (SSO) Setup

Single Sign-On (SSO) integration enables enterprise organizations to authenticate users through their existing identity provider, streamlining access management and enhancing security across your documentation workflow.

<Info>
SSO integration is available exclusively for enterprise customers. Schedule a call with our team or email us at [help@gopromptless.ai](mailto:help@gopromptless.ai) to discuss enterprise plans and your SSO requirements.
</Info>

## Supported Authentication Methods

Promptless supports enterprise authentication through industry-standard protocols:

- **SAML 2.0**: Compatible with enterprise identity providers including Active Directory Federation Services, Okta, OneLogin, and Azure AD
- **OpenID Connect (OIDC)**: Modern authentication protocol supporting Google Workspace, Azure AD, and other OIDC-compliant providers
- **Direct integrations**: Native support for Google Workspace and GitHub Enterprise authentication

## Prerequisites

Before requesting SSO setup, ensure your organization has:

- An active Promptless enterprise subscription
- Administrative access to your identity provider
- The ability to configure SAML assertions or OIDC claims for user attributes
- A verified domain configured in your Promptless organization settings

## Requesting SSO Configuration

SSO setup requires coordination between your IT team and Promptless. The process involves providing specific configuration details to our team.

<Steps>
  <Step title="Collect Identity Provider Information">
    Gather the required configuration details from your identity provider:

    **For SAML 2.0 Integration:**
    - Identity Provider (IdP) Entity ID or Issuer URL
    - Single Sign-On Service URL
    - X.509 Certificate (public key for signature verification)
    - Attribute mappings for email, first name, and last name fields

    **For OpenID Connect (OIDC):**
    - Issuer URL (discovery endpoint)
    - Client ID and Client Secret
    - Authorization endpoint and Token endpoint URLs
    - Supported scopes and user attribute claims
  </Step>

  <Step title="Submit Configuration Request">
    Contact our support team at [help@gopromptless.ai](mailto:help@gopromptless.ai) to discuss your setup. If you have a dedicated account manager, you can also coordinate directly with them. Share:

    - Your organization name and verified domain
    - Preferred authentication method (SAML 2.0 or OIDC)
    - The configuration information collected in Step 1
  </Step>

  <Step title="Configuration and Validation">
    Our team will configure the SSO integration and provide:

    - Service Provider (SP) metadata for your identity provider configuration
    - User attribute mapping and role assignment configuration
  </Step>
</Steps>

## Post-Configuration User Experience

Once SSO is active, team members will experience seamless authentication:

- **Automatic Identity Provider Redirect**: Users accessing Promptless are redirected to your organization's login portal
- **Single Authentication**: After successful IdP authentication, users gain immediate access to Promptless
- **Just-in-Time User Provisioning**: New users are automatically created based on their identity provider profile
- **Role and Permission Mapping**: User access levels can be synchronized from your identity management system

## Security and Compliance Benefits

SSO integration provides enhanced security controls:

- **Centralized Access Management**: Control Promptless access through existing identity management workflows
- **Multi-Factor Authentication Enforcement**: Leverage your identity provider's MFA requirements
- **Unified Session Management**: Consistent session handling across organizational applications
- **Comprehensive Audit Trails**: Complete authentication and access logging for compliance requirements

## Support and Implementation

Have questions about SSO setup or want to discuss your organization's specific authentication requirements? Hop on a call with our enterprise support team—reach out at [help@gopromptless.ai](mailto:help@gopromptless.ai) to schedule.

We'll work directly with you and your IT department to ensure smooth implementation and integration with your existing security infrastructure.
