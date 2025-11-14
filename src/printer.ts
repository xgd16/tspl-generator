import * as commands from "./commands";
import {
  LabelConfig,
  MeasurementSystem,
  TextOptions,
  Font,
  Rotation,
  BarcodeType,
} from "./types";

/**
 * TSPL Printer class for generating TSPL commands
 */
export class TSPLPrinter {
  private buffer: string;
  private measurementSystem: MeasurementSystem;

  /**
   * Create a new TSPL printer instance
   * @param measurementSystem - The measurement system to use
   */
  constructor(
    measurementSystem: MeasurementSystem = MeasurementSystem.ENGLISH
  ) {
    this.buffer = "";
    this.measurementSystem = measurementSystem;
  }

  /**
   * Initialize the printer with basic settings
   * @param config - Label configuration
   * @returns The printer instance for method chaining
   */
  public initialize(config: LabelConfig): this {
    const {
      width,
      height,
      speed = 3,
      density = 8,
      gap = 3,
      gapOffset = 0,
      measurementSystem = this.measurementSystem,
    } = config;

    this.buffer = "";
    this.buffer += commands.size(width, height, measurementSystem);
    this.buffer += commands.speed(speed);
    this.buffer += commands.density(density);
    this.buffer += commands.gap(gap, gapOffset, measurementSystem);
    this.buffer += commands.cls();
    return this;
  }

  /**
   * Set the gap between labels
   * @param gap - Gap distance
   * @param offset - Offset distance
   * @returns The printer instance for method chaining
   */
  public setGap(gap: number, offset: number = 0): this {
    this.buffer += commands.gap(gap, offset, this.measurementSystem);
    return this;
  }

  /**
   * Add text to the label
   * @param options - Text options
   * @returns The printer instance for method chaining
   */
  public addText(options: TextOptions): this {
    const {
      x,
      y,
      font,
      rotation = 0,
      xMultiplier = 1,
      yMultiplier = 1,
      text,
    } = options;

    this.buffer += commands.text(
      x,
      y,
      font,
      rotation,
      xMultiplier,
      yMultiplier,
      text
    );
    return this;
  }

  /**
   * Set a custom command
   * 
   * @param command - The command to set
   * @returns The printer instance for method chaining
   */
  public setCommand(command: string): this { 
    this.buffer += command;
    return this;
  }

  /**
   * Add a text block to the label
   * @param x - X coordinate
   * @param y - Y coordinate
   * @param width - Width of the block
   * @param height - Height of the block
   * @param font - Font name or number
   * @param text - Text content
   * @param rotation - Rotation angle
   * @param xMultiplier - Horizontal multiplier
   * @param yMultiplier - Vertical multiplier
   * @param lineSpacing - Line spacing
   * @param alignment - Text alignment
   * @returns The printer instance for method chaining
   */
  public addTextBlock(
    x: number,
    y: number,
    width: number,
    height: number,
    font: Font | string,
    text: string,
    rotation: Rotation = Rotation.NO_ROTATION,
    xMultiplier: number = 1,
    yMultiplier: number = 1,
    lineSpacing: number = 0,
    alignment: "L" | "C" | "R" | "J" = "L"
  ): this {
    this.buffer += commands.block(
      x,
      y,
      width,
      height,
      font,
      rotation,
      xMultiplier,
      yMultiplier,
      lineSpacing,
      alignment,
      text
    );
    return this;
  }

  /**
   * Add a barcode to the label
   * @param x - X coordinate
   * @param y - Y coordinate
   * @param barcodeType - Type of barcode
   * @param height - Height of barcode
   * @param content - Barcode content
   * @param readable - Human readable text
   * @param rotation - Rotation angle
   * @param narrow - Narrow bar width
   * @param wide - Wide bar width
   * @returns The printer instance for method chaining
   */
  public addBarcode(
    x: number,
    y: number,
    barcodeType: BarcodeType | string,
    height: number,
    content: string,
    readable: 0 | 1 = 1,
    rotation: Rotation = Rotation.NO_ROTATION,
    narrow: number = 2,
    wide: number = 4
  ): this {
    this.buffer += commands.barcode(
      x,
      y,
      barcodeType,
      height,
      readable,
      rotation,
      narrow,
      wide,
      content
    );
    return this;
  }

  /**
   * Add a QR code to the label
   * @param x - X coordinate
   * @param y - Y coordinate
   * @param content - QR code content
   * @param eccLevel - Error correction level
   * @param cellWidth - Cell width
   * @param mode - Mode
   * @param rotation - Rotation angle
   * @returns The printer instance for method chaining
   */
  public addQRCode(
    x: number,
    y: number,
    content: string,
    eccLevel: "L" | "M" | "Q" | "H" = "M",
    cellWidth: number = 6,
    mode: "A" | "M" = "A",
    rotation: Rotation = Rotation.NO_ROTATION
  ): this {
    this.buffer += commands.qrcode(
      x,
      y,
      eccLevel,
      cellWidth,
      mode,
      rotation,
      content
    );
    return this;
  }

  /**
   * Add a box to the label
   * @param x - X coordinate of top-left corner
   * @param y - Y coordinate of top-left corner
   * @param xEnd - X coordinate of bottom-right corner
   * @param yEnd - Y coordinate of bottom-right corner
   * @param thickness - Line thickness
   * @returns The printer instance for method chaining
   */
  public addBox(
    x: number,
    y: number,
    xEnd: number,
    yEnd: number,
    thickness: number = 1
  ): this {
    this.buffer += commands.box(x, y, xEnd, yEnd, thickness);
    return this;
  }

  /**
   * Add a line to the label
   * @param x - X coordinate of start point
   * @param y - Y coordinate of start point
   * @param xEnd - X coordinate of end point
   * @param yEnd - Y coordinate of end point
   * @param thickness - Line thickness
   * @returns The printer instance for method chaining
   */
  public addLine(
    x: number,
    y: number,
    xEnd: number,
    yEnd: number,
    thickness: number = 1
  ): this {
    this.buffer += commands.line(x, y, xEnd, yEnd, thickness);
    return this;
  }

  /**
   * Add a circle to the label
   * @param x - X coordinate of center
   * @param y - Y coordinate of center
   * @param diameter - Diameter of circle
   * @param thickness - Line thickness
   * @returns The printer instance for method chaining
   */
  public addCircle(
    x: number,
    y: number,
    diameter: number,
    thickness: number = 1
  ): this {
    this.buffer += commands.circle(x, y, diameter, thickness);
    return this;
  }

  /**
   * Add an ellipse to the label
   * @param x - X coordinate of center
   * @param y - Y coordinate of center
   * @param width - Width of ellipse
   * @param height - Height of ellipse
   * @param thickness - Line thickness
   * @returns The printer instance for method chaining
   */
  public addEllipse(
    x: number,
    y: number,
    width: number,
    height: number,
    thickness: number = 1
  ): this {
    this.buffer += commands.ellipse(x, y, width, height, thickness);
    return this;
  }

  /**
   * Add a bitmap image to the label
   * @param x - X coordinate
   * @param y - Y coordinate
   * @param width - Width of bitmap in bytes
   * @param height - Height of bitmap in dots
   * @param mode - Mode (0: normal, 1: XOR)
   * @param bitmap - Bitmap data in hexadecimal format
   * @returns The printer instance for method chaining
   */
  public addBitmap(
    x: number,
    y: number,
    width: number,
    height: number,
    bitmap: string,
    mode: 0 | 1 = 0
  ): this {
    this.buffer += commands.bitmap(x, y, width, height, mode, bitmap);
    return this;
  }

  /**
   * Add a BMP image to the label
   * @param x - X coordinate
   * @param y - Y coordinate
   * @param filename - BMP filename
   * @returns The printer instance for method chaining
   */
  public addBMP(x: number, y: number, filename: string): this {
    this.buffer += commands.putbmp(x, y, filename);
    return this;
  }

  /**
   * Print the label
   * @param copies - Number of copies to print
   * @returns The printer instance for method chaining
   */
  public print(copies: number = 1): this {
    this.buffer += commands.print(copies);
    return this;
  }

  /**
   * Clear the image buffer
   * @returns The printer instance for method chaining
   */
  public clear(): this {
    this.buffer += commands.cls();
    return this;
  }

  /**
   * Get the generated TSPL code
   * @returns The complete TSPL code
   */
  public getBuffer(): string {
    return this.buffer;
  }

  /**
   * Reset the buffer
   * @returns The printer instance for method chaining
   */
  public reset(): this {
    this.buffer = "";
    return this;
  }

  // Add more methods...
}
