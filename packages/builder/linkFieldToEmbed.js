export function getEmbed(link) {
  const url = new URL(link);
  switch (url.hostname) {
    case "twitter.com": {
      return `
      <iframe border=0 frameborder=0 width=550 height=380 src="https://twitframe.com/show?url=${encodeURI(
        url.href
      )}"></iframe>
    `;
    }
    case "soundcloud.com": {
      const config = {
        color: "#323c62",
        url: link,
        auto_play: false,
        hide_related: true,
        show_comments: true,
        show_user: true,
        show_reposts: false,
        show_teaser: false,
      };
      const configStr = Object.keys(config)
        .map((key) => `${key}=${escape(config[key])}`)
        .join("&");
      const src = `https://w.soundcloud.com/player/?${configStr}`;
      return `
        <iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="${src}"></iframe>
      `;
      // todo playlists
      /* <iframe width="100%" height="450" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1005356413&color=%23323c62&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe><div style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"><a href="https://soundcloud.com/mr-onion" title="mr.kev" target="_blank" style="color: #cccccc; text-decoration: none;">mr.kev</a> · <a href="https://soundcloud.com/mr-onion/sets/summer-1995" title="Summer 1995" target="_blank" style="color: #cccccc; text-decoration: none;">Summer 1995</a></div> */
    }
    case "www.youtube.com":
    case "youtube.com": {
      const id = url.searchParams.get("v");
      return `<center style="height:315px;"><iframe width="560" height="315" src="https://www.youtube.com/embed/${id}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></center>`;
    }

    default:
      console.log("unknown link", url.hostname);
  }
}

export function linkFieldToEmbed(page) {
  if (!page.link) {
    return;
  }

  page.embed = getEmbed(page.link);
}

// Based on: https://stackoverflow.com/questions/19377262/regex-for-youtube-url
const YOUTUBE_URL_IN_OWNLINE_REGEX =
  /^\n(?:(?:https?:)?\/\/)?(?:(?:www|m)\.)?((?:youtube(?:-nocookie)?\.com|youtu.be))(?:\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$\n\n/gim;

export function preprocessSpecialEmbeds(page) {
  const replaced = page.content.replaceAll(
    YOUTUBE_URL_IN_OWNLINE_REGEX,
    (_match, _hostname, id) => {
      return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${id}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>\n\n`;
    }
  );
  page.content = replaced;
}
