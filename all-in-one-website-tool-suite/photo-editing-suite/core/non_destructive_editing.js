// Non-Destructive Editing (JavaScript)

class AdjustmentLayer {
  constructor(filter, opacity = 1.0) {
    this.filter = filter;
    this.opacity = opacity;
  }

  applyTo(image) {
    // Apply filter with opacity to the image
    // Placeholder: actual implementation depends on image processing library
    return image.applyFilter(this.filter).setOpacity(this.opacity);
  }
}

// Example usage
const brightnessLayer = new AdjustmentLayer('brightness(1.2)', 0.8);
const editedImage = brightnessLayer.applyTo(someImage);
