const { ipcRenderer } = require('electron')

// 编码 srt
export class EncoderSrt {
  public plat: string
  public room: string
  public url: string
  public ffmpeggProcess: any | undefined = undefined

  constructor(plat: string, room: string) {
    this.plat = plat
    this.room = room
    this.url = `srt://localhost:10080?streamid=#!::r=live/${room},m=publish`
  }

  public async runWithExec(command: string, channel: string) {
    ipcRenderer.send(channel, command)
  }

  public async runWithSpawn(command: string, args: string[]) {
    ipcRenderer.send('ffmpegCommandSpawn', JSON.stringify({ command, args }))
  }

  public async cameraStreamSpawn() {
    if (this.plat == 'linux') {
      this.runWithSpawn('ffmpeg', [
        '-f',
        'v4l2',
        '-i',
        '/dev/video0',
        '-f',
        'alsa',
        '-ac',
        '2',
        '-i',
        'hw:1,0',
        '-c:v',
        'libx264',
        '-preset',
        'veryfast',
        '-maxrate',
        '3000k',
        '-bufsize',
        '6000k',
        '-pix_fmt',
        'yuv420p',
        '-g',
        '50',
        '-r',
        '30',
        '-s',
        '640x480',
        '-c:a',
        'aac',
        '-b:a',
        '160k',
        '-ac',
        '2',
        '-ar',
        '44100',
        '-f',
        'mpegts',
        this.url
      ])
    } else if (this.plat == 'win32') {
      this.runWithSpawn('ffmpeg', [
        '-f',
        'dshow',
        '-rtbufsize',
        '100M',
        '-i',
        'video="HP Wide Vision HD Camera":audio="麦克风阵列 (英特尔® 智音技术)"',
        '-c:v',
        'libx264',
        '-preset',
        'veryfast',
        '-maxrate',
        '3000k',
        '-bufsize',
        '6000k',
        '-pix_fmt',
        'yuv420p',
        '-g',
        '50',
        '-r',
        '30',
        '-s',
        '640x480',
        '-c:a',
        'aac',
        '-b:a',
        '160k',
        '-ac',
        '2',
        '-ar',
        '44100',
        '-f',
        'mpegts',
        this.url
      ])
    }
  }

  public async desktopStreamSpawn() {
    if (this.plat == 'linux') {
      this.runWithSpawn('ffmpeg', [
        '-f',
        'x11grab',
        '-s',
        '1920x1080',
        '-i',
        ':0.0',
        '-f',
        'alsa',
        '-ac',
        '2',
        '-i',
        'hw:1,0',
        '-c:v',
        'libx264',
        '-preset',
        'veryfast',
        '-maxrate',
        '3000k',
        '-bufsize',
        '6000k',
        '-pix_fmt',
        'yuv420p',
        '-g',
        '50',
        '-r',
        '30',
        '-c:a',
        'aac',
        '-b:a',
        '160k',
        '-ac',
        '2',
        '-ar',
        '44100',
        '-f',
        'mpegts',
        this.url
      ])
    } else if (this.plat == 'win32') {
      this.runWithSpawn('ffmpeg', [
        '-f',
        'gdigrab',
        '-rtbufsize',
        '100M',
        '-i',
        'desktop',
        '-f',
        'dshow',
        '-i',
        'audio="麦克风阵列 (英特尔® 智音技术)"',
        '-c:v',
        'libx264',
        '-preset',
        'veryfast',
        '-maxrate',
        '3000k',
        '-bufsize',
        '6000k',
        '-pix_fmt',
        'yuv420p',
        '-g',
        '50',
        '-r',
        '30',
        '-s',
        '1920x1080',
        '-c:a',
        'aac',
        '-b:a',
        '160k',
        '-ac',
        '2',
        '-ar',
        '44100',
        '-f',
        'mpegts',
        this.url
      ])
    }
  }

  public destroy() {
    // if (this.ffmpegProcess) {
    //   this.ffmpegProcess.kill('SIGINT')
    // }
  }
}
