// Trigger reload of environment variables
import ImageKit from "@imagekit/nodejs";
import { env } from "../config/env";

const imagekit = new ImageKit({
  privateKey: env.IMAGEKIT_PRIVATE_KEY,
});

/**
 * Generate authentication parameters for frontend direct upload to ImageKit.
 */
export const getImageKitAuthParams = () => {
  return imagekit.helper.getAuthenticationParameters();
};

export { imagekit };
