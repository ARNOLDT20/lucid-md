{ pkgs }: {
  deps = [
    pkgs.nodejs-18_x
    pkgs.ffmpeg
    pkgs.python3
    pkgs.pkg-config
    pkgs.libwebp
  ];
}
