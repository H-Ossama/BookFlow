import { sendEmail } from '../config/email';

function bookingEmailHtml(opts: { type: string; customerName: string; serviceName: string; employeeName: string; date: string; time: string; price: number; companyName: string }) {
  const { customerName, serviceName, employeeName, date, time, price, companyName } = opts;
  return `
<!DOCTYPE html>
<html><body style="font-family:Arial,sans-serif;background:#f4f4f4;padding:20px">
<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden">
<div style="background:#c5a880;padding:20px;text-align:center"><h2 style="color:#0a0c10;margin:0">${companyName}</h2></div>
<div style="padding:30px">
<h3 style="margin-top:0">${opts.type === 'confirmed' ? 'Booking Confirmed' : opts.type === 'cancelled' ? 'Booking Cancelled' : 'New Booking Created'}</h3>
<p>Hi ${customerName},</p>
${opts.type === 'confirmed' ? '<p>Your booking has been <strong>confirmed</strong>!</p>' : opts.type === 'cancelled' ? '<p>Your booking has been <strong>cancelled</strong>.</p>' : '<p>A new booking has been created. We\'ll confirm it shortly.</p>'}
<table style="width:100%;border-collapse:collapse;margin:20px 0">
<tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666">Service</td><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">${serviceName}</td></tr>
<tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666">Staff</td><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">${employeeName}</td></tr>
<tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666">Date</td><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">${date}</td></tr>
<tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666">Time</td><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">${time}</td></tr>
<tr><td style="padding:8px;color:#666">Price</td><td style="padding:8px;font-weight:bold">$${price.toFixed(2)}</td></tr>
</table>
<p style="color:#999;font-size:12px">If you have any questions, please contact the business directly.</p>
</div>
</div></body></html>`;
}

export class EmailService {
  static async sendBookingCreated(customerEmail: string, opts: { customerName: string; serviceName: string; employeeName: string; date: string; time: string; price: number; companyName: string }) {
    await sendEmail(customerEmail, 'Booking Created - Awaiting Confirmation', bookingEmailHtml({ ...opts, type: 'created' }));
  }

  static async sendBookingConfirmed(customerEmail: string, opts: { customerName: string; serviceName: string; employeeName: string; date: string; time: string; price: number; companyName: string }) {
    await sendEmail(customerEmail, 'Booking Confirmed', bookingEmailHtml({ ...opts, type: 'confirmed' }));
  }

  static async sendBookingCancelled(customerEmail: string, opts: { customerName: string; serviceName: string; employeeName: string; date: string; time: string; price: number; companyName: string }) {
    await sendEmail(customerEmail, 'Booking Cancelled', bookingEmailHtml({ ...opts, type: 'cancelled' }));
  }
}
