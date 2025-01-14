let handler = async (m, { conn, isAdmin, isOwner, args, usedPrefix, command }) => {
  if (!(isAdmin || isOwner)) {
	  global.dfail('admin', m, conn)
          throw false
  }
  let isClose = {
	  'open': 'not_announcement',
	  'abrir': 'not_announcement',
      'on': 'not_announcement',
	  '1': 'not_announcement',
	  'close': 'announcement',
	  'cerrar': 'announcement',
      'off': 'announcement',
      '0': 'announcement',
  }[(args[0] || '')]
  if (isClose === undefined) {
	  let caption = `
*FORMATO ERRONEO!!*
 
 ${usedPrefix + command} abrir 1*
 ${usedPrefix + command} cerrar 1*
 *Ejemplo de uso:* *${usedPrefix + command} cerrar 1* 
 Para que el grupo este cerrado una hora.*

`
      m.reply(caption)
	  throw false
  }
  let timeoutset = 86400000 * args[1] / 24
  await conn.groupSettingUpdate(m.chat, isClose).then(async _=> {
	  m.reply(` *Grupo ${isClose == 'announcement' ? 'cerrado' : 'abierto'} ${args[1] ? `durante*${clockString(timeoutset)}*` : ''}`)
  })
  if (args[1]) {
	 setTimeout(async () => {
            await conn.groupSettingUpdate(m.chat, `${isClose == 'announcement' ? 'not_announcement' : 'announcement'}`).then(async _=>{
		    conn.reply(m.chat, `${isClose == 'not_announcement' ? '*El grupo ha sido cerrado, ahora solo los administradores pueden enviar mensajes!*' : '*El grupo se ha abierto, ahora todos los miembros pueden enviar mensajes!*'}!`)
	    })
        }, timeoutset)
  }
  }
handler.help = ['grupohora abrir <horas>|grupohora cerrar <horas>']
handler.tags = ['group']
//handler.command = /^(grupohora|gptime)$/i

handler.botAdmin = true
handler.group = true 
export default handler

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  console.log({ms,h,m,s})
  return [h, m, s].map(v => v.toString().padStart(2, 0) ).join(':')
}
