import React from 'react'

export default function EmojiPicker({ onSelect }) {
  const emojis = [
    '😀','😂','😍','😎','😢','😡','👍','🙏','🔥','🎉','❤️','👏','😅','😇','🤔','🙌','🥳','😜','😱','🤩','😏','😬','😴','🤗','😋','😤','😳','😆','😝','😔','😑','😃','😄','😁','😆','😅','🤣','😊','😇','🙂','🙃','😉','😌','😍','🥰','😘','😗','😙','😚','😋','😛','😜','🤪','😝','🤑','🤗','🤭','🤫','🤔','🤐','🤨','😐','😑','😶','😏','😒','🙄','😬','🤥','😌','😔','😪','🤤','😴','😷','🤒','🤕','🤢','🤮','🤧','🥵','🥶','🥴','😵','🤯','🤠','🥳','😎','🤓','🧐','😕','😟','🙁','☹️','😮','😯','😲','😳','🥺','😦','😧','😨','😰','😥','😢','😭','😱','😖','😣','😞','😓','😩','😫','🥱','😤','😡','😠','🤬','😈','👿','💀','☠️','🤡','👹','👺','👻','👽','👾','🤖','😺','😸','😹','😻','😼','😽','🙀','😿','😾'
  ];
  return (
    <div className="grid grid-cols-8 gap-1 p-2 max-h-40 overflow-y-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
      {emojis.map(e => (
        <button
          key={e}
          className="text-xl hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
          onClick={() => onSelect(e)}
          type="button"
        >
          {e}
        </button>
      ))}
    </div>
  )
}
