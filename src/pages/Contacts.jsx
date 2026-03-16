import db from "../data/drinks.json";

const CONTACTS = db.contacts;

export default function Contacts() {
  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest text-green-600 uppercase mb-1">遇事不决</p>
        <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">紧急联系</h2>
        <p className="text-zinc-500 text-sm mt-1">遇到问题时的联系方式</p>
      </div>

      <div className="space-y-2.5 mb-8">
        {CONTACTS.map((c) => (
          <div
            key={c.name}
            className="bg-white border border-zinc-200 rounded-xl p-4 flex items-center gap-4"
          >
            <div className="flex-shrink-0 flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-50 border border-zinc-100 text-xl">
              {c.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-zinc-900 text-sm">{c.name}</p>
              <p className="text-zinc-400 text-xs mt-0.5">{c.role}</p>
              <a
                href={`tel:${c.phone.replace(/\D/g, "")}`}
                className="text-green-600 font-bold text-sm hover:text-green-700 mt-1 block transition-colors"
              >
                {c.phone}
              </a>
            </div>
            <a
              href={`tel:${c.phone.replace(/\D/g, "")}`}
              className="flex-shrink-0 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white w-9 h-9 rounded-full flex items-center justify-center transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
            </a>
          </div>
        ))}
      </div>

      {/* Store info */}
      <div className="bg-zinc-900 text-white rounded-xl p-5">
        <p className="text-xs font-semibold tracking-widest text-zinc-500 uppercase mb-3">店铺地址</p>
        <p className="text-zinc-100 font-semibold">10 Provost Street</p>
        <p className="text-zinc-400 text-sm">Jersey City, NJ 07302</p>
        <a
          href="https://maps.google.com/?q=10+Provost+Street+Jersey+City+NJ+07302"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-4 text-green-500 text-sm font-medium hover:text-green-400 transition-colors"
        >
          在 Google Maps 中查看
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </a>
      </div>
    </div>
  );
}
