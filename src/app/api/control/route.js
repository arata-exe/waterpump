// src/app/api/control/route.js

import { NextResponse } from 'next/server';

export async function GET(request) {
  const url = new URL(request.url);
  const action = url.searchParams.get('action');
  
  const raspberryPiUrl = `http://192.168.1.127/${action}`;  // เปลี่ยนเป็น IP ของ Raspberry Pi Pico W
  
  try {
    const response = await fetch(raspberryPiUrl);
    const data = await response.text();
    return NextResponse.json({ message: 'Success', data });
  } catch (error) {
    return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 });
  }
}
