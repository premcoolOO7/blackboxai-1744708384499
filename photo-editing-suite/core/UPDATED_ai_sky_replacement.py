import cv2
import numpy as np

def segment_sky(image):
    """Segment the sky from the image using color detection."""
    # Convert the image to the HSV color space
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    
    # Define the range for sky color in HSV
    lower_sky = np.array([90, 50, 50])  # Lower bound for sky color
    upper_sky = np.array([130, 255, 255])  # Upper bound for sky color
    
    # Create a mask for the sky
    mask = cv2.inRange(hsv, lower_sky, upper_sky)
    
    return mask

def replace_sky(image, new_sky):
    """Replace the sky in the image with a new sky image."""
    sky_mask = segment_sky(image)
    center = (image.shape[1]//2, image.shape[0]//2)
    blended = cv2.seamlessClone(new_sky, image, sky_mask, center, cv2.NORMAL_CLONE)
    return blended
