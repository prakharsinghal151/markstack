export interface UploadedImage {
  url: string;
  alt: string;
  name: string;
}

export async function uploadImage(file: File): Promise<UploadedImage> {
  // Simulate upload - in production, you'd upload to a service
  return new Promise((resolve) => {
    setTimeout(() => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        resolve({
          url,
          alt: file.name,
          name: file.name,
        });
      };
      reader.readAsDataURL(file);
    }, 500);
  });
}

export function createImageMarkdown(image: UploadedImage): string {
  return `![${image.alt}](${image.url})`;
}
