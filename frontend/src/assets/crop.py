from PIL import Image
img = Image.open('logo.png')
bg = Image.new(img.mode, img.size, img.getpixel((0,0)))
diff = Image.new(img.mode, img.size)
diff.paste(img)
bbox = diff.getbbox()
if bbox:
    cropped = img.crop(bbox)
    cropped.save('logo.png')
    print("Cropped successfully")
else:
    print("Bounding box not found")
