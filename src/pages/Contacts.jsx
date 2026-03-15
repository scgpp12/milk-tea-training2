import db from "../data/drinks.json";

const CONTACTS = db.contacts;

export default function Contacts() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-5">
      <h2 className="text-2xl font-bold text-stone-800 mb-1">📞 紧急联系</h2>
      <p className="text-stone-400 text-sm mb-5">遇到问题时的联系方式</p>

      <div className="space-y-3">
        {CONTACTS.map((c) => (
          <div
            key={c.name}
            className="bg-white border border-stone-200 rounded-2xl p-4 flex items-center gap-4"
          >
            <span className="text-4xl flex-shrink-0">{c.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-stone-800">{c.name}</p>
              <p className="text-stone-400 text-xs">{c.role}</p>
              <a
                href={`tel:${c.phone.replace(/\D/g, "")}`}
                className="text-amber-600 font-bold text-lg hover:text-amber-700 mt-0.5 block"
              >
                {c.phone}
              </a>
            </div>
            <a
              href={`tel:${c.phone.replace(/\D/g, "")}`}
              className="flex-shrink-0 bg-amber-500 hover:bg-amber-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg transition-colors"
            >
              📲
            </a>
          </div>
        ))}
      </div>

      {/* Store address */}
      <div className="mt-6 bg-stone-50 border border-stone-200 rounded-2xl p-4">
        <p className="font-bold text-stone-700 mb-2 text-sm">📍 店铺地址</p>
        <p className="text-stone-600 text-sm">
          10 Provost Street, Jersey City, NJ 07302
        </p>
        <a
          href="https://maps.google.com/?q=10+Provost+Street+Jersey+City+NJ+07302"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 text-amber-600 text-sm font-medium hover:underline"
        >
          在地图中查看 →
        </a>
      </div>
    </div>
  );
}
