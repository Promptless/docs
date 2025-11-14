# Data Handling and Classification

Promptless is designed with data minimization in mind, ensuring that we only store what's necessary to provide our documentation automation service and keeping Promptless's risk level at a minimum. This page explains how we handle your data when you use Promptless.

## Data Classification

| Data Category | Promptless Handling | Description |
|--------------|----------------|-------------|
| Documentation Copies | Stored by Promptless | Public documentation copies for automation and change tracking |
| Third-party Integration Data | Processed, not stored | Promptless can be triggered by third-party tools, and processes data to provide services, but does not store any data beyond the duration needed to provide documentation updates |
| End-user Data | Not Processed | Sensitive end-user data is not processed or stored |

### Data that Promptless stores

Promptless stores minimal data, and otherwise operates in a stateless manner to avoid storing any data that is not necessary to provide the service.
- **Documentation Copies**: Promptless stores copies of your documentation to enable our automation features and track changes. This documentation is typically public, and so is generally not considered sensitive data. 
- **Feedback for Promptless**: Promptless stores feedback that you provide to it about the quality of documentation updates, which can take the form of edits that you've made to Promptless suggestions, or direct feedback you've made on the Promptless dashboard. 
- **Integration Auth Data**: When you link Promptless to a third party tool, we store the data necessary to integrate with that tool. This typically includes an authentication token, not the actual content of the data from the third party tool.

### Data that Promptless processes, but does not store

Promptless users can integrate Promptless's services with a number of third party tools, in order to automatically trigger documentation updates or provide additional context for documentation updates. This data is used to provide the Promptless service, and is not stored by Promptless. **Promptless does not retain a copy of customer source code, support conversations, or any other data from third party integrations.**

For example:
- When a GitHub PR triggers a documentation check, we analyze the changes in real-time without storing the PR content
- When using Slack integration, we process conversations to identify documentation needs but don't maintain copies of the conversations
- When accessing context from tools like Linear or Jira, we only use the information to inform documentation updates at the time of generation, without storing a copy of issues or projects 

**Note:** Promptless does not use customer data for pre-training or fine-tuning language models. 

### Data that Promptless does not process
- **End-user data**: Promptless is not configurable to process or store sensitive end-user data for your organization. 

## User Authentication and Access Controls 

### Standard Authentication Features

Our platform provides robust authentication mechanisms for all users:
- SSO with Google or GitHub supported for all users 
- Strong password policies enforcing complexity requirements
- Two-factor authentication (2FA) support using industry-standard TOTP
- Password reset workflows with secure verification

### Enterprise Authentication Features

Enterprise plan customers receive access to advanced authentication capabilities:

- Single Sign-On (SSO) integration supporting major identity providers
- SAML 2.0 support with:
  - Just-in-time user provisioning
  - Role mapping
  - Certificate-based authentication
- OpenID Connect (OIDC) compatibility for modern authentication workflows
- Custom MFA policies and enforcement

## Data Security

### Encryption Standards
- All data in transit is encrypted using TLS 1.2 or higher, ensuring secure communication between all system components
- Data at rest (both in primary data stores and secondary backups) is protected using AES-256 encryption, with keys managed through a secure key management system
- Backup data is encrypted using independent encryption keys for additional security

## Enterprise Security Support

Enterprise customers may request additional security features and support, such as custom data retention policies. 


## Additional Data Protection Measures

### Data Loss Prevention
We use Data Loss Prevention (DLP) software to prevent accidental transmission of sensitive information via email. These controls help protect sensitive data even when human error occurs.

### Backup Encryption
In addition to encrypting data at rest in our primary data stores, all backup data is encrypted using independent encryption keys. This provides additional security for data recovery scenarios.

### Key Management
Encryption keys are managed through secure key management systems provided by our cloud infrastructure provider. Access to production encryption keys is restricted to authorized personnel only.

## Audit and Compliance Capabilities

### Activity Logging
We maintain activity logs across all systems, including:
- Administrative activities and configuration changes
- User authentication and access events
- Data access and modifications
- System-level security events

Logs are securely stored and retained for a minimum of one year to support auditing, troubleshooting, and compliance requirements.

### Access Controls
We control access to logs and sensitive systems using a combination of security measures:
- Role-based access control (RBAC)
- Principle of least privilege
- Regular access reviews and audits
- Immediate access revocation upon termination

Only authorized personnel can access sensitive data, and all access is logged and monitored.

## Questions About Data Handling?

If you have specific questions about how we handle data or need more information, please contact us at help@gopromptless.ai.

Promptless implements comprehensive security measures to protect customer data and ensure secure access to our platform. Our multi-layered approach to security encompasses data encryption, access controls, and robust authentication mechanisms.


