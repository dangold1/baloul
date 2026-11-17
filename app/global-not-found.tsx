import type { Metadata } from "next";
import "@/styles";
import { heebo } from "./fonts";

export const metadata: Metadata = { title: "העמוד לא נמצא | Page not found · BALOUL" };

/** One 404 for both languages (there are two root layouts, so it cannot come from either). Next marks it noindex. */
export default function GlobalNotFound() {
  return (
    <html lang="he" dir="rtl" className={heebo.variable}>
      <body>
        <div className="site">
          <main id="top" className="b-legal-page">
            <section className="b-legal-overlay">
              <article className="b-legal-dialog">
                <h1>העמוד לא נמצא</h1>
                <p>
                  <a href="/">חזרה לעמוד הבית</a>
                </p>
                <div lang="en" dir="ltr">
                  <h2>Page not found</h2>
                  <p>
                    <a href="/en">Back to the home page</a>
                  </p>
                </div>
              </article>
            </section>
          </main>
        </div>
      </body>
    </html>
  );
}
