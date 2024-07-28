import Image from '../public/Mindmate.png'

export default async function Page() {
  return (
    <div>
      <div className="note--empty-state">
        <span className="note-text--empty-state">
          <img
            className=""
            src="/Mindmate.png"
            width="162px"
            height="160px"
            alt=""
            role="presentation"
          />
        </span>
      </div>
      <div>Click a note on the left to view something!</div>
    </div>
  )
}
