import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import { ReportRepository } from '../repositories/report.repository';

function formatDate(d: Date) {
  return d.toISOString().split('T')[0];
}

function pdfBuffer(doc: PDFKit.PDFDocument): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    doc.on('data', (c: Buffer) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    doc.end();
  });
}

export class ReportService {
  static async getBookingsCSV(companyId: string, dateFrom: string, dateTo: string) {
    const data = await ReportRepository.getBookings(companyId, new Date(dateFrom), new Date(dateTo));
    const header = 'Date,Time,Service,Duration,Employee,Email,Status,Price,Discount,Coupon,Notes\n';
    const rows = data.map((b) =>
      [formatDate(b.date), b.startTime, b.service.name, `${b.service.duration}min`, `${b.employee.user.firstName} ${b.employee.user.lastName}`, b.employee.user.email, b.status, b.totalPrice.toFixed(2), b.discountAmount.toFixed(2), b.coupon?.code || '', (b.notes || '').replace(/,/g, ';')].join(',')
    ).join('\n');
    return header + rows;
  }

  static async getBookingsExcel(companyId: string, dateFrom: string, dateTo: string) {
    const data = await ReportRepository.getBookings(companyId, new Date(dateFrom), new Date(dateTo));
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Bookings');
    ws.columns = [
      { header: 'Date', key: 'date', width: 14 },
      { header: 'Time', key: 'time', width: 10 },
      { header: 'Service', key: 'service', width: 20 },
      { header: 'Duration', key: 'duration', width: 10 },
      { header: 'Employee', key: 'employee', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Price', key: 'price', width: 10 },
      { header: 'Discount', key: 'discount', width: 10 },
      { header: 'Coupon', key: 'coupon', width: 12 },
      { header: 'Notes', key: 'notes', width: 30 },
    ];
    const style = { font: { name: 'Arial', size: 10 }, alignment: { vertical: 'top' as const } };
    ws.getRow(1).font = { bold: true, name: 'Arial', size: 10 };
    data.forEach((b) => ws.addRow({
      date: formatDate(b.date), time: b.startTime, service: b.service.name, duration: `${b.service.duration}min`,
      employee: `${b.employee.user.firstName} ${b.employee.user.lastName}`, email: b.employee.user.email,
      status: b.status, price: b.totalPrice, discount: b.discountAmount, coupon: b.coupon?.code || '', notes: b.notes || '',
    }).eachCell((c) => { c.style = style; }));
    const buf = await wb.xlsx.writeBuffer();
    return Buffer.from(buf);
  }

  static async getBookingsPDF(companyId: string, dateFrom: string, dateTo: string) {
    const data = await ReportRepository.getBookings(companyId, new Date(dateFrom), new Date(dateTo));
    const doc = new PDFDocument({ margin: 30, size: 'A4', layout: 'landscape' });
    doc.fontSize(16).text('Bookings Report', { align: 'center' }).fontSize(10).text(`${dateFrom} to ${dateTo}`, { align: 'center' }).moveDown(2);

    const headers = ['Date', 'Time', 'Service', 'Emp.', 'Status', 'Price'];
    const colX = [30, 110, 150, 300, 380, 440];
    const rowH = 16;
    let y = doc.y;

    doc.font('Helvetica-Bold').fontSize(8);
    headers.forEach((h, i) => doc.text(h, colX[i], y, { width: 80 }));
    y += rowH;

    doc.font('Helvetica').fontSize(7);
    for (const b of data) {
      if (y > 550) { doc.addPage(); y = 30; doc.font('Helvetica-Bold').fontSize(8); headers.forEach((h, i) => doc.text(h, colX[i], y, { width: 80 })); y += rowH; doc.font('Helvetica').fontSize(7); }
      const vals = [formatDate(b.date), b.startTime, b.service.name, `${b.employee.user.firstName.slice(0, 1)}.${b.employee.user.lastName}`, b.status, `$${b.totalPrice.toFixed(2)}`];
      vals.forEach((v, i) => doc.text(v, colX[i], y, { width: 80 }));
      y += rowH;
    }
    return pdfBuffer(doc);
  }

  static async getRevenueCSV(companyId: string, dateFrom: string, dateTo: string) {
    const data = await ReportRepository.getRevenue(companyId, new Date(dateFrom), new Date(dateTo));
    const header = 'Date,Service,Revenue,Discount,Status\n';
    const rows = data.map((b) => [formatDate(b.date), b.service.name, b.totalPrice.toFixed(2), b.discountAmount.toFixed(2), b.status].join(',')).join('\n');
    return header + rows;
  }

  static async getRevenuePDF(companyId: string, dateFrom: string, dateTo: string) {
    const data = await ReportRepository.getRevenue(companyId, new Date(dateFrom), new Date(dateTo));
    const total = data.reduce((s, b) => s + b.totalPrice, 0);
    const totalDiscount = data.reduce((s, b) => s + b.discountAmount, 0);
    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    doc.fontSize(18).text('Revenue Report', { align: 'center' }).fontSize(10).text(`${dateFrom} to ${dateTo}`, { align: 'center' }).moveDown(2);
    doc.fontSize(12).text(`Total Revenue: $${total.toFixed(2)}`);
    doc.text(`Total Discounts: $${totalDiscount.toFixed(2)}`);
    doc.text(`Net Revenue: $${(total - totalDiscount).toFixed(2)}`);
    doc.text(`Total Bookings: ${data.length}`);
    doc.moveDown(2);
    doc.fontSize(10).text('Daily Breakdown:', { underline: true }).moveDown(0.5);
    doc.fontSize(8);
    for (const b of data) {
      doc.text(`${formatDate(b.date)} | ${b.service.name} | $${b.totalPrice.toFixed(2)} (discount: $${b.discountAmount.toFixed(2)}) | ${b.status}`);
    }
    return pdfBuffer(doc);
  }

  static async getCustomersCSV(companyId: string, dateFrom: string, dateTo: string) {
    const { users, bookings } = await ReportRepository.getCustomers(companyId, new Date(dateFrom), new Date(dateTo));
    const header = 'Customer ID,Name,Email,Total Spent,Booking Count,First Booking\n';
    const customerAgg = users.map((u) => {
      const userBookings = bookings.filter((b) => b.customerId === u.id && b.status !== 'CANCELLED');
      const totalSpent = userBookings.reduce((s, b) => s + b.totalPrice, 0);
      const firstBooking = userBookings.length > 0 ? formatDate(new Date(Math.min(...userBookings.map((b) => new Date(b.createdAt).getTime())))) : '';
      return [u.id, `${u.firstName} ${u.lastName}`, u.email, totalSpent.toFixed(2), userBookings.length, firstBooking].join(',');
    }).join('\n');
    return header + customerAgg;
  }
}
