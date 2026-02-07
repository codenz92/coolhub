'use server'
import { headers } from 'next/headers';

export async function getIpData(targetIp?: string) {
    const headerList = await headers();
    const visitorIp = headerList.get('x-forwarded-for')?.split(',')[0] || '8.8.8.8';
    const queryIp = targetIp || visitorIp;

    // fields=66842623 includes: status, message, country, countryCode, region, 
    // regionName, city, zip, lat, lon, timezone, isp, org, as, reverse, mobile, proxy, hosting
    const response = await fetch(`http://ip-api.com/json/${queryIp}?fields=66842623`);
    return await response.json();
}