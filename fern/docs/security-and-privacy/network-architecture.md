# Network Architecture

Promptless utilizes a secure, modern cloud-based network architecture designed for reliability, security, and scalability. Our infrastructure is built on industry-leading cloud platforms with multiple layers of security controls and redundancy.

## Infrastructure Overview

<Frame caption="Promptless Network Architecture">
  <img src="https://promptless-customer-doc-assets.s3.amazonaws.com/docs-images/org_2lvkgU9erOFxYhtEVVC0ymPrPdF/e549b619-c0f6-42a0-b495-e538f71fb1cb-network_architecture_diagram.png" alt="Promptless Network Architecture" />
</Frame>


Our infrastructure is designed with the following key principles:
- Security by design at every layer
- High availability and fault tolerance
- Scalability and performance optimization
- Comprehensive monitoring and observability

## Multi-Tenant Security Model

Promptless uses a strong logical separation model for multi-tenant data security:

### Organization-Level Isolation

- Every piece of data (users, suggestions, trigger events, etc.) is tagged with a specific organization ID
- All database queries are automatically scoped to the requesting organization
- Authorization mechanisms prevent cross-organization data access
- No shared data contexts between different customer organizations

Promptless's shared infrastructure provides increased scalability and security, since it reduces the number of infrastructure assets that need to be tracked and maintained and decreases the number of data access points across the system.

## Key Security Measures

While we can't highlight all of Promptless's security measures here, we've highlighted some of the key ones below:
* Data encryption in transit: All data at rest is encrypted using TLS 1.2 or later.
* Data encryption at rest: Data stored in Promptless's database is encrypted with AES-256.
* Data access controls: We use a combination of access controls, including role-based access control (RBAC), to ensure that only authorized users have access to sensitive data.
* Principle of least privilege: We only give users the minimum permissions they need for their role.
* Logical separation of data: All data is tagged with customer identifiers, to ensure multiple layers of logical separation between Promptless users 


For more detailed information about our network architecture or to discuss specific security requirements, please contact our security team at help@gopromptless.ai.