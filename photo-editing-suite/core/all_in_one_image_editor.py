import argparse
import os
import numpy as np
from PIL import Image, ImageColor, ImageEnhance

def parse_arguments():
    parser = argparse.ArgumentParser(description="All-in-One Image Editor")
    parser.add_argument("input_path", help="Path to input image file")
    parser.add_argument("output_path", help="Path to save edited image")
    parser.add_argument("--size", nargs=2, type=int, required=True,
                        help="Target dimensions (width height)")
    parser.add_argument("--format", required=True,
                        choices=["JPEG", "PNG", "BMP", "GIF", "TIFF"],
                        help="Output format")
    parser.add_argument("--background", default="#FFFFFF",
                        help="Background color (name/hex) or image path")
    parser.add_argument("--transparent-color",
                        help="Color to make transparent (name/hex)")
    parser.add_argument("--tolerance", type=int, default=30,
                        help="Color matching tolerance (0-255)")
    parser.add_argument("--brightness", type=float, default=1.0,
                        help="Brightness adjustment factor (default 1.0)")
    parser.add_argument("--contrast", type=float, default=1.0,
                        help="Contrast adjustment factor (default 1.0)")
    parser.add_argument("--rotate", type=int, default=0,
                        help="Rotate image by degrees (clockwise)")
    parser.add_argument("--flip-horizontal", action="store_true",
                        help="Flip image horizontally")
    parser.add_argument("--flip-vertical", action="store_true",
                        help="Flip image vertically")
    return parser.parse_args()

def create_transparency(img, color, tolerance):
    """Replace specified color with transparency"""
    arr = np.array(img.convert("RGBA"))
    target = np.array(ImageColor.getrgb(color))
    distance = np.abs(arr[..., :3] - target)
    mask = np.all(distance <= tolerance, axis=2)
    arr[..., 3] = np.where(mask, 0, arr[..., 3])
    return Image.fromarray(arr)

def create_background(target_size, background_arg):
    """Create background image from color or existing image"""
    try:
        color = ImageColor.getrgb(background_arg)
        return Image.new("RGBA", target_size, color)
    except ValueError:
        if os.path.exists(background_arg):
            bg = Image.open(background_arg)
            return bg.resize(target_size, Image.Resampling.LANCZOS).convert("RGBA")
        raise ValueError("Invalid background input")

def main():
    args = parse_arguments()
    target_size = tuple(args.size)

    # Open and process input image
    img = Image.open(args.input_path).convert("RGBA")
    
    # Apply transparency if requested
    if args.transparent_color:
        img = create_transparency(img, args.transparent_color, args.tolerance)

    # Resize image while maintaining aspect ratio
    img.thumbnail(target_size, Image.Resampling.LANCZOS)

    # Apply rotation
    if args.rotate != 0:
        img = img.rotate(-args.rotate, expand=True)

    # Apply flips
    if args.flip_horizontal:
        img = img.transpose(Image.FLIP_LEFT_RIGHT)
    if args.flip_vertical:
        img = img.transpose(Image.FLIP_TOP_BOTTOM)

    # Apply brightness and contrast adjustments
    if args.brightness != 1.0:
        enhancer = ImageEnhance.Brightness(img)
        img = enhancer.enhance(args.brightness)
    if args.contrast != 1.0:
        enhancer = ImageEnhance.Contrast(img)
        img = enhancer.enhance(args.contrast)

    # Create background
    bg = create_background(target_size, args.background)

    # Composite images
    position = (
        (target_size[0] - img.width) // 2,
        (target_size[1] - img.height) // 2
    )
    bg.paste(img, position, img)

    # Convert format if needed and save
    if args.format == "JPEG":
        bg = bg.convert("RGB")
    bg.save(args.output_path, format=args.format)

if __name__ == "__main__":
    main()
