const { bot, parsedJid, getRandom, setVar } = require('../lib/')

bot(
  {
    pattern: 'areact ?(.*)',
    desc: 'auto react to messages',
    type: 'misc',
  },
  async (message, match) => {
    if (!match)
      return await message.send(
        '> Example :\n- areact on | off\n- areact not_react 2364723@g.us\n- areact react_only 72534823@g.us\n- areact only_pm\n- areact only_group'
      )
    await setVar({ AREACT: match }, message.id)
    await message.send('AREACT updated, bot restarts')
  }
)
const emojis =
  '🌈,🪽,🎂,👻,🇵🇰,🙀,🤴🏻,👑,💍,🕶️,🎓,🐥,🦋,🦚,🪶,🦜,🦢,🐾,🌝,🔥,💫,🌈,🪐,🌍,☃️,🪀,🪂🪫,💎,🧨,🔮,🛡️,🎈,🎀,🥀,💌,🖇️,📌,🕉️,✅,🔱,🛜,🆗,🆕,🆙,📶,🎶,🔜,🔝,☑️,🔊,🔔,😊,👍,🙏,💙,🇵🇰,💞'.split(
    ','
  )

bot({ on: 'text', fromMe: false, type: 'auto_react' }, async (message, match, ctx) => {
  const on_off = ctx.AREACT ? ctx.AREACT.includes('false') : true
  if (on_off) return
  const not_react_jids = ctx.AREACT && ctx.AREACT.includes('not_react')
  const not_gids = (not_react_jids && parsedJid(ctx.AREACT)) || []
  if (not_gids.length) {
    if (not_gids.includes(message.jid)) return
  }
  const react_jids = ctx.AREACT && ctx.AREACT.includes('react_only')
  const gids = (react_jids && parsedJid(ctx.AREACT)) || []
  if (gids.length) {
    if (!gids.includes(message.jid)) return
  }
  const onlyPm = ctx.AREACT && ctx.AREACT.includes('only_pm')
  const onlyGroup = ctx.AREACT && ctx.AREACT.includes('only_group')
  const isReact =
    !message.fromMe &&
    (onlyPm ? !message.isGroup : !onlyPm) &&
    (onlyGroup ? message.isGroup : !onlyGroup)

  if (!isReact) return

  const react = {
    text: getRandom(emojis),
    key: message.message.key,
  }
  return await message.send(react, {}, 'react')
})
