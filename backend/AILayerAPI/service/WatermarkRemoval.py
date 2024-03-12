import cv2
import numpy as np


class WatermarkRemoval:

    def __init__(self, file_url, file_dir):
        self.file_url = file_url
        self.file_dir = file_dir + "modified_image.jpg"

    def remove_hidden_mark(self):
        img = cv2.imread(self.file_url)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        threshold_value, binary_image = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
        contours, hierarchy = cv2.findContours(binary_image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        for c in contours:
            x, y, w, h = cv2.boundingRect(c)
            cv2.rectangle(img, (x, y), (x + w, y + h), (255, 255, 255), -1)
        cv2.imshow("Modified Image", img)
        cv2.waitKey(0)
        cv2.imwrite(self.file_dir, img)

    def remove_watermark(self):
        img = cv2.imread(self.file_url)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        ret, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
        kernel = np.ones((3, 3), np.uint8)
        opening = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel, iterations=1)
        contours, hierarchy = cv2.findContours(opening, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        mask = np.ones(img.shape[:2], dtype="uint8") * 255
        c = max(contours, key=cv2.contourArea)
        cv2.drawContours(mask, [c], -1, 0, -1)
        output = cv2.inpaint(img, mask, 5, cv2.INPAINT_TELEA)
        cv2.imshow("output", output)
        cv2.waitKey(0)
        cv2.imwrite(self.file_dir, img)
