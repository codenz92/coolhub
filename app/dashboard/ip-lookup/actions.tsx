'use server'
import { headers } from 'next/headers';

export async function getIpData(targetIp?: string) {
    const headerList = await headers();
    // Identifies the real visitor IP from Nginx or falls back to a test IP
    const visitorIp = headerList.get('x-forwarded-for')?.split(',')[0] || '8.8.8.8';
    const queryIp = targetIp || visitorIp;

    // Requests all technical and geographical fields available
    const response = await fetch(`http://ip-api.com/json/${queryIp}?fields=66842623`);
    return await response.json();
}