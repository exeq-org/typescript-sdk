export interface Session {
    id: string;
    status: 'creating' | 'queued' | 'active' | 'stopping' | 'stopped' | 'failed';
    cdpUrl: string;
    vncUrl: string;
    vncPassword: string;
    expiresAt: string | null;
    createdAt: string;
    sessionRecordingEnabled?: boolean;
    sessionRecordingUrl?: string | null;
    residentialProxyEnabled?: boolean;
}
export interface CreateSessionOptions {
    duration?: string;
    sessionRecordingEnabled?: boolean;
    profileId?: string;
    residentialProxyEnabled?: boolean;
    residentialProxyCountry?: string;
    residentialProxyState?: string;
    residentialProxyCity?: string;
}
export interface ListSessionsOptions {
    limit?: number;
    offset?: number;
}
export interface Profile {
    id: string;
    name: string;
    createdAt: string;
}
export interface ExeqClientOptions {
    apiKey: string;
    baseUrl?: string;
}
