'use server'
import { headers } from 'next/headers';

export async function getIpData(targetIp?: string) {
    const headerList = await headers();

    // Get the visitor's IP from Nginx or fallback for local dev
    const visitorIp = headerList.get('x-forwarded-for')?.split(',')[0] || '8.8.8.8';

    const queryIp = targetIp || visitorIp;

    const response = await fetch(`http://ip-api.com/json/${queryIp}`);
    const data = await response.json();

    return data;
}