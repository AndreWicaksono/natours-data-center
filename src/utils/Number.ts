export function formatRupiah(amount: number): string {
  return "Rp" + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
