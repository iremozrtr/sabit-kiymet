import { ReactNode } from "react";

interface FormFieldProps {
  etiket: string;
  htmlFor: string;
  zorunlu?: boolean;
  hata?: string;
  yardim?: string;
  children: ReactNode;
}

export function FormField({ etiket, htmlFor, zorunlu, hata, yardim, children }: FormFieldProps) {
  return (
    <div className={`field${hata ? " field--error" : ""}`}>
      <label htmlFor={htmlFor}>
        {etiket}
        {zorunlu && <span className="field__req"> *</span>}
      </label>
      {children}
      {hata ? <span className="field__msg">{hata}</span> : yardim && <span className="field__help">{yardim}</span>}
    </div>
  );
}
