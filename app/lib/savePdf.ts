// lib/thumbnail-generator.ts
import { toPng, toJpeg } from 'html-to-image';

export async function generateThumbnail(
  elementId: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'jpeg' | 'png';
    backgroundColor?: string;
  } = {}
): Promise<{ success: boolean; dataUrl?: string; blob?: Blob; error?: string }> {
  const {
    width = 176,
    height = 264,
    quality = 0.9,
    format = 'jpeg',
    backgroundColor = '#ffffff', // fill phần dư
  } = options;

  try {
    const element = document.getElementById(elementId);
    if (!element) throw new Error(`Element #${elementId} not found`);

    await document.fonts.ready;
    await new Promise(r => setTimeout(r, 100));

    const rect = element.getBoundingClientRect();

    // ✅ CHỈ SCALE THEO WIDTH
    const scale = width / rect.width;
    const scaledHeight = rect.height * scale;

    const dataUrl =
      format === 'png'
        ? await toPng(element, {
            cacheBust: true,
            pixelRatio: 1,
            width,
            height,
            backgroundColor,
            style: {
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              width: `${rect.width}px`,
              height: `${rect.height}px`,
              overflow: 'hidden',
            },
          })
        : await toJpeg(element, {
            cacheBust: true,
            quality,
            width,
            height,
            backgroundColor,
            style: {
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              width: `${rect.width}px`,
              height: `${rect.height}px`,
              overflow: 'hidden',
            },
          });

    const blob = await (await fetch(dataUrl)).blob();

    return { success: true, dataUrl, blob };
  } catch (error) {
    console.error('Thumbnail generation error:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to generate thumbnail',
    };
  }
}
