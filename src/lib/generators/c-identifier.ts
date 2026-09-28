const reserved = new Set(
  `auto break case char const continue default do double else enum extern float for goto if inline int long register restrict return short signed sizeof static struct switch typedef union unsigned void volatile while alignas alignof bool constexpr false nullptr static_assert thread_local true typeof typeof_unqual _alignas _alignof _atomic _bitint _bool _complex _decimal128 _decimal32 _decimal64 _generic _imaginary _noreturn _static_assert _thread_local art widget parent top widgets state screen size_t ptrdiff_t draw_top set_battery_status battery_status_update_cb battery_status_get_state get_state set_connection_status output_status_update_cb`.split(
    " ",
  ),
);

export function sanitizeCIdentifier(input: string) {
  let name = input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 63);
  if (!name) return "";
  if (/^[0-9]/.test(name)) name = `_${name}`;
  if (
    reserved.has(name) ||
    /^(lv_|zmk_(widget_|display_|split_|battery_|usb_|ble_)|sys_|u?int\d+_t$)/.test(
      name,
    )
  )
    name = `custom_${name}`;
  return name;
}

export function requireCIdentifier(input: string) {
  const name = sanitizeCIdentifier(input);
  if (!name)
    throw new Error(
      "Enter an artwork name containing at least one letter or number.",
    );
  return name;
}
