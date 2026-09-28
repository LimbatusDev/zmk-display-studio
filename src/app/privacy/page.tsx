import Link from "next/link";
import { ContentPage, ContentSection } from "@/components/layout/content-page";
import { preferencesKey } from "@/lib/editor-preferences";
import { themeStorageKey } from "@/lib/theme";
import { pageMetadata } from "@/lib/page-metadata";
import { infoPages } from "@/lib/site";

export const metadata = pageMetadata(infoPages.privacy);

const sections = [
  { id: "your-images", title: "Your images stay local" },
  { id: "saved-preferences", title: "What the browser saves" },
  { id: "your-session", title: "Your working session" },
  { id: "website-requests", title: "Website requests" },
  { id: "your-controls", title: "Your controls" },
];

export default function PrivacyPage() {
  return (
    <ContentPage
      page={infoPages.privacy}
      title={
        <>
          Your artwork.
          <br />
          <span className="text-primary">Your browser.</span>
        </>
      }
      introduction="The editor processes images and creates exports on your device. Here’s what stays in memory, what gets saved, and what happens when you visit the site."
      sections={sections}
    >
      <ContentSection {...sections[0]}>
        <p>
          When you choose an image, your browser decodes it locally. Cropping,
          resizing, brightness, contrast, dithering, and inversion run using
          browser Canvas APIs. The editor does not upload your source image or
          processed pixels to a server.
        </p>
        <p>
          C files and ZIP packages are generated locally, too. Selecting a file,
          processing it, and generating an export do not require network
          requests. The built-in sample is also generated in your browser.
        </p>
      </ContentSection>
      <ContentSection {...sections[1]}>
        <p>
          The app uses <strong>localStorage</strong> to remember a small set of
          validated preferences:
        </p>
        <ul>
          <li>Processing mode and threshold</li>
          <li>Brightness, contrast, and inversion</li>
          <li>Preview mode and the pixel grid preference</li>
        </ul>
        <p>
          These live under <code>{preferencesKey}</code>. Older version-one
          preferences can be migrated when present. If browser storage is
          unavailable, editing still works.
        </p>
        <p>
          Your light or dark theme choice is saved separately under{" "}
          <code>{themeStorageKey}</code>. Until you choose a theme, the site
          follows your device’s appearance setting. This preference changes the
          interface, not your artwork or exports.
        </p>
        <p>
          Source files, image data, file names, artwork names, and crop
          transforms are <strong>not saved to localStorage</strong>. The app
          does not use accounts, analytics, or tracking cookies.
        </p>
      </ContentSection>
      <ContentSection {...sections[2]}>
        <p>
          Your selected image, artwork name, and composition remain in memory
          while you use the site in the same tab. You can open a guide through
          the site navigation and return to the editor without losing that work.
        </p>
        <p>
          This is not a saved project. Reloading the page or closing the tab
          clears the working artwork. A separate tab has its own working
          session. Replacing or removing an image releases the previous source
          from the editor.
        </p>
        <p>
          Downloaded files are saved wherever your browser places downloads.
          Copying C code puts the generated text on your system clipboard when
          you request it and the browser permits it.
        </p>
      </ContentSection>
      <ContentSection {...sections[3]}>
        <p>
          Your browser makes normal requests to load the website and its assets,
          and to navigate between pages. Those requests are separate from image
          processing; your selected artwork is not included in them.
        </p>
        <p>
          The hosting service receives the information needed to serve those
          requests, such as an IP address and browser request headers. Local
          image processing is not a promise that no website access logs exist.
        </p>
        <p>
          Following an external link, such as ZMK documentation or a GitHub
          revision, takes you to another service with its own privacy practices.
        </p>
      </ContentSection>
      <ContentSection {...sections[4]}>
        <ul>
          <li>
            Use the image removal control to clear the current source and crop.
          </li>
          <li>Reload or close the tab to clear the working session.</li>
          <li>
            Use your browser’s site-data settings to remove saved preferences
            for this site. This clears the current and any older preference
            keys.
          </li>
          <li>
            Manage downloaded exports and copied code through your device’s file
            and clipboard controls.
          </li>
        </ul>
        <p>
          <strong>Reset adjustments</strong> resets processing values; it does
          not erase all saved preferences or remove the selected image. For
          editor controls, see <Link href="/how-to-use">How to Use</Link>.
        </p>
      </ContentSection>
    </ContentPage>
  );
}
