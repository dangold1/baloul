/** Netlify Forms spam trap plus the hidden form-name field Netlify requires for JS submissions. */
export function NetlifyFields({ formName }: { formName: string }) {
  return (
    <>
      <input type="hidden" name="form-name" value={formName} />
      <p style={{ display: "none" }}>
        <label>
          לא למלא <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>
    </>
  );
}
