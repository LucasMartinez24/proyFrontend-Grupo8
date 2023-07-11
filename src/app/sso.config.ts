import { AuthConfig } from 'angular-oauth2-oidc';
export const authCodeFlowConfig: AuthConfig = {
  // Url of the Identity Provider
  issuer: 'https://accounts.google.com',
  // URL of the SPA to redirect the user to after login
  redirectUri: window.location.origin + '.nip.io',
  // The SPA's id. The SPA is registerd with this id at the auth-server
  // clientId: 'server.code',
  clientId:
    '989832783745-cp1uiv1g4hhf3qh0bkgcilbls624cpb7.apps.googleusercontent.com',
  // Just needed if your auth server demands a secret. In general, this
  // is a sign that the auth server is not configured with SPAs in mind
  // and it might not enforce further best practices vital for security
  // such applications.
  dummyClientSecret: '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',
  responseType: 'code',
  // set the scope for the permissions the client should request
  // The first four are defined by OIDC.
  // Important: Request offline_access to get a refresh token
  // The api scope is a usecase specific one
  scope:
    'openid profile email https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events',
  showDebugInformation: true,
  strictDiscoveryDocumentValidation: false,
};
