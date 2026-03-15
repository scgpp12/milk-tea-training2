import db from "../data/drinks.json";

const CONTACTS = db.contacts;

export default function Contacts() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">紧急联系</h2>
        <p className="text-gray-500 text-sm mt-1">遇到问题时的联系方式</p>
      </div>

      <div className="space-y-3 mb-6">
        {CONTACTS.map((c) => (
          <div
            key={c.name}
            className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 shadow-sm"
          >
            <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-2xl">
              {c.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900">{c.name}</p>
              <p className="text-gray-400 text-xs mt-0.5">{c.role}</p>
              <a
                href={`tel:${c.phone.replace(/\D/g, "")}`}
                className="text-amber-600 font-bold text-base hover:text-amber-700 mt-1 block transition-colors"
              >
                {c.phone}
              </a>
            </div>
            <a
              href={`tel:${c.phone.replace(/\D/g, "")}`}
              className="flex-shrink-0 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
            </a>
          </div>
        ))}
      </div>

      {/* Store info */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            店铺地址
          </h3>
        </div>
        <div className="px-4 py-4">
          <p className="text-gray-700 text-sm">10 Provost Street</p>
          <p className="text-gray-700 text-sm">Jersey City, NJ 07302</p>
          <a
            href="https://maps.google.com/?q=10+Provost+Street+Jersey+City+NJ+07302"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-3 text-amber-600 text-sm font-medium hover:text-amber-700 transition-colors"
          >
            在 Google Maps 中查看
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
