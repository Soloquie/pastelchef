import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { CustomCake } from '../types/cake';
import {
  CAKE_SHAPES,
  CAKE_SPONGES,
  CAKE_FILLINGS,
  CAKE_FROSTINGS,
  CAKE_TOPPINGS,
} from '../data/cakeOptions';

/**
 * Converts an SVG element directly into a PNG data URL using standard canvas rasterization.
 * 100% reliable across modern browsers and doesn't get blocked by SVG filters or CSS classes.
 */
async function rasterizeSvgToPng(svgElement: SVGSVGElement): Promise<string> {
  const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;
  clonedSvg.setAttribute('width', '500');
  clonedSvg.setAttribute('height', '440');

  const svgString = new XMLSerializer().serializeToString(clonedSvg);
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const URLObj = window.URL || window.webkitURL || window;
  const blobUrl = URLObj.createObjectURL(svgBlob);

  return new Promise<string>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 1000;
        canvas.height = 880;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          URLObj.revokeObjectURL(blobUrl);
          resolve(canvas.toDataURL('image/png'));
        } else {
          URLObj.revokeObjectURL(blobUrl);
          reject(new Error('Canvas context unavailable'));
        }
      } catch (err) {
        URLObj.revokeObjectURL(blobUrl);
        reject(err);
      }
    };
    img.onerror = (e) => {
      URLObj.revokeObjectURL(blobUrl);
      reject(e);
    };
    img.src = blobUrl;
  });
}

/**
 * Finds the visual cake element for this cake in the DOM and extracts its PNG image.
 */
async function getCakeImage(cake: CustomCake, elementId?: string): Promise<string | null> {
  // 1. Try finding container by specific cake ID
  let container = document.getElementById(`cake-visualizer-${cake.id}`);

  // 2. Try by passed elementId
  if (!container && elementId) {
    container = document.getElementById(elementId);
  }

  // 3. Try generic workshop canvas
  if (!container) {
    container = document.getElementById('cake-workshop-canvas');
  }

  // 4. Try extracting SVG from container
  if (container) {
    const svg = container.querySelector('svg');
    if (svg) {
      try {
        return await rasterizeSvgToPng(svg);
      } catch {
        // Fallback to html2canvas on container
        try {
          const canvas = await html2canvas(container, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#FFFFFF',
            logging: false,
          });
          return canvas.toDataURL('image/png');
        } catch {
          // ignore
        }
      }
    }
  }

  // 5. If container wasn't found, find any cake SVG on the page
  const anySvg = document.querySelector('svg[viewBox="0 0 500 440"]') as SVGSVGElement | null;
  if (anySvg) {
    try {
      return await rasterizeSvgToPng(anySvg);
    } catch {
      // ignore
    }
  }

  return null;
}

export async function exportCakeToPDF(
  cake: CustomCake,
  visualizerElementId?: string
): Promise<void> {
  const shape = CAKE_SHAPES.find((s) => s.id === cake.shapeId) || CAKE_SHAPES[0];
  const sponge = CAKE_SPONGES.find((s) => s.id === cake.spongeId) || CAKE_SPONGES[0];
  const filling = CAKE_FILLINGS.find((f) => f.id === cake.fillingId) || CAKE_FILLINGS[0];
  const frosting = CAKE_FROSTINGS.find((f) => f.id === cake.frostingId) || CAKE_FROSTINGS[0];
  const selectedToppings = CAKE_TOPPINGS.filter((t) => cake.toppingIds.includes(t.id));

  // Initialize PDF (A4 Portrait, mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  // 1. Playful Background & Double Decorative Borders
  doc.setFillColor(255, 252, 245);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  doc.setDrawColor(248, 187, 208); // Pink
  doc.setLineWidth(2.5);
  doc.roundedRect(8, 8, pageWidth - 16, pageHeight - 16, 6, 6, 'D');

  doc.setDrawColor(255, 213, 79); // Golden
  doc.setLineWidth(1);
  doc.roundedRect(11, 11, pageWidth - 22, pageHeight - 22, 4, 4, 'D');

  // 2. Playful Header Banner
  doc.setFillColor(255, 112, 166);
  doc.roundedRect(margin, margin, contentWidth, 26, 4, 4, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('DIPLOMA DE CHEF PASTELERO', margin + contentWidth / 2, margin + 11, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(255, 245, 248);
  doc.text('Certificado Oficial de Creacion de Pastel Magico', margin + contentWidth / 2, margin + 19, { align: 'center' });

  // 3. Cake Title
  let currentY = margin + 36;
  doc.setTextColor(55, 40, 35);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text(cake.name, margin + contentWidth / 2, currentY, { align: 'center' });

  currentY += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(150, 110, 95);
  const dateStr = new Date(cake.updatedAt || Date.now()).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  doc.text(`Fecha de celebracion: ${dateStr}`, margin + contentWidth / 2, currentY, { align: 'center' });

  currentY += 8;

  // 4. Retrieve and ALWAYS display the Cake Image
  const cakeImgData = await getCakeImage(cake, visualizerElementId);

  // Layout: Left column has the featured Cake Picture (86mm), Right column has the Recipe (88mm)
  const imgBoxWidth = 86;
  const imgBoxHeight = 80;
  const recipeBoxWidth = contentWidth - imgBoxWidth - 4;
  const recipeBoxX = margin + imgBoxWidth + 4;

  // A. Cake Picture Frame Box on Left
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(255, 182, 193); // Light pink
  doc.setLineWidth(1.5);
  doc.roundedRect(margin, currentY, imgBoxWidth, imgBoxHeight, 4, 4, 'FD');

  if (cakeImgData) {
    // Render actual captured cake image inside frame
    doc.addImage(cakeImgData, 'PNG', margin + 3, currentY + 3, imgBoxWidth - 6, imgBoxHeight - 6);
  } else {
    // If no image could be captured, draw a clean vector cake silhouette
    doc.setFillColor(255, 240, 245);
    doc.roundedRect(margin + 6, currentY + 6, imgBoxWidth - 12, imgBoxHeight - 12, 3, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(255, 71, 126);
    doc.text('PASTEL DECORADO', margin + imgBoxWidth / 2, currentY + imgBoxHeight / 2 - 2, { align: 'center' });
    doc.setFontSize(10);
    doc.setTextColor(120, 100, 90);
    doc.text(shape.name, margin + imgBoxWidth / 2, currentY + imgBoxHeight / 2 + 6, { align: 'center' });
  }

  // Label above/under image
  doc.setFillColor(255, 240, 245);
  doc.roundedRect(margin + 4, currentY + imgBoxHeight - 9, imgBoxWidth - 8, 7, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(216, 27, 96);
  doc.text(`DISENO: ${shape.name.toUpperCase()}`, margin + imgBoxWidth / 2, currentY + imgBoxHeight - 4.5, { align: 'center' });

  // B. Secret Recipe Box on Right
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(255, 205, 120);
  doc.setLineWidth(1.5);
  doc.roundedRect(recipeBoxX, currentY, recipeBoxWidth, imgBoxHeight, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(230, 81, 0); // Warm orange
  doc.text('RECETA SECRETA DEL PASTEL', recipeBoxX + recipeBoxWidth / 2, currentY + 8, { align: 'center' });

  const drawFriendlyRow = (emojiTitle: string, value: string, rowY: number) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(85, 60, 50);
    doc.text(emojiTitle, recipeBoxX + 5, rowY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 40, 35);
    doc.text(value, recipeBoxX + 34, rowY);
  };

  drawFriendlyRow('1. Forma:', shape.name, currentY + 18);
  drawFriendlyRow('2. Bizcocho:', sponge.name, currentY + 28);
  drawFriendlyRow('3. Relleno:', filling.name, currentY + 38);
  drawFriendlyRow('4. Glaseado:', `${frosting.name} (Arriba)`, currentY + 48);

  const toppingsList = selectedToppings.length > 0
    ? selectedToppings.map((t) => t.name).join(', ')
    : '¡Pastel suave al natural!';

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(85, 60, 50);
  doc.text('5. Dulces:', recipeBoxX + 5, currentY + 58);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 40, 35);
  const splitToppings = doc.splitTextToSize(toppingsList, recipeBoxWidth - 38);
  doc.text(splitToppings, recipeBoxX + 34, currentY + 58);

  currentY += imgBoxHeight + 8;

  // 5. Custom Piped Message Card (if any)
  if (cake.customMessage && cake.customMessage.trim().length > 0) {
    doc.setFillColor(255, 243, 224);
    doc.setDrawColor(255, 183, 77);
    doc.roundedRect(margin, currentY, contentWidth, 20, 3, 3, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(230, 81, 0);
    doc.text('MENSAJE ESCRITO EN EL PASTEL:', margin + 6, currentY + 6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(60, 40, 35);
    doc.text(`"${cake.customMessage}"`, margin + contentWidth / 2, currentY + 14, { align: 'center' });

    currentY += 26;
  }

  // 6. Award Star Badge & Chef Notes
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(178, 235, 242);
  doc.roundedRect(margin, currentY, contentWidth, 38, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(0, 137, 123);
  doc.text('PREMIO AL MEJOR CHEF PASTELERO', margin + contentWidth / 2, currentY + 8, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(90, 80, 75);
  const friendlyNotes = [
    '• Este pastel fue preparado con amor, sonrisas y los ingredientes mas ricos.',
    '• ¡Listo para compartir rebanadas deliciosas con toda la familia y amigos!',
    '• Consejo de chef: ¡No olvides pedir un deseo antes de cortar el pastel!',
  ];

  friendlyNotes.forEach((fn, idx) => {
    doc.text(fn, margin + 8, currentY + 16 + idx * 6);
  });

  currentY += 46;

  // 7. Footer
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 112, 166);
  doc.text('PastelChef - El Taller de Crear Pasteles Divertidos', margin + contentWidth / 2, currentY, { align: 'center' });

  // Save the PDF
  const safeName = cake.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
  doc.save(`PastelChef_${safeName}.pdf`);
}
