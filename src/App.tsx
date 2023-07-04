import { useCallback, useEffect, useMemo, useState } from 'react';
// @ts-ignore
import DiscordLogoColor from './Discord-Logo-Color.svg';
// @ts-ignore
import TwitterLogoColor from './Twitter-Logo-Blue.svg';
import React from 'react';
//import YouTubePlayer from 'youtube-player';
// @ts-ignore
//import { GameAbbreviation, tracks } from './music.ts';
//import { YouTubePlayer as YouTubePlayerT } from 'youtube-player/dist/types';
//import PlayerStates from 'youtube-player/dist/constants/PlayerStates';

// todo
// - play acnh/ww music in background depending on time of day
//   - kk slider jukebox app for controlling playback/game to use soundtrack from
// - ACNH background image on bigger screens

interface ProjectApp {
  id: number;
  name: string;
  image: string;
  summary?: string;
  links?: { name?: string; url: string }[];
  type?: 'discord' | 'twitter' | 'website';
  createdAt?: Date;
  defunctAt?: Date;
  themeColor?: string;
  themeTextColor?: string;
}

const typeSvgs: Record<string, string> = {
  discord: DiscordLogoColor,
  twitter: TwitterLogoColor,
}

const metaApps: ProjectApp[] = [
  {
    id: 0,
    name: 'kys.mom',
    summary: 'Hejcia furrasku! ;3',
    themeColor: '#eae6cd',
    themeTextColor: '#000',
    createdAt: new Date(2023, 4, 12),
    links: [
      { name: 'TikTok', url: 'https://www.tiktok.com/@igorekowo7' },
      { name: 'Instagram', url: 'https://www.instagram.com/igorekuwu/' },
      { name: 'YouTube', url: 'https://www.youtube.com/@igorekowo' },
      { name: 'Spotify', url: 'https://open.spotify.com/user/31no7jklwxihujhxpahc4pndv5iy?si=a5f110affc0246d7' }
    ],
    image: 'https://cdn.discordapp.com/attachments/1121146707154043037/1125863622715908149/pfp2.png',
    type: 'website',
  },
];

const apps: ProjectApp[] = [
  {
    id: 1,
    name: 'Catify',
    summary: 'Music bot >.< (under maintenance)',
    themeColor: '#ffd89d',
    themeTextColor: '#9E5500',
    links: [{ url: 'https://catify.kys.mom'}],
    image: 'https://cdn.discordapp.com/avatars/1125705462726266920/9952ec2f11186d087dbc14aa20473c42.png?size=1024',
    type: 'discord',
    createdAt: new Date(2023, 7, 4),
  },
  {
    id: 2,
    name: 'Galeria Jajek',
    summary: 'Galaria mojego kochanego kolegi laha',
    themeColor: '#172025',
    themeTextColor: '#dff1ff',
    links: [{ url: 'https://owo.kys.mom'}],
    image: 'https://media.discordapp.net/attachments/1125676517096169573/1125676578886668288/unknown_10.png',
    type: 'website',
    createdAt: new Date(2023, 7, 4),
  },
];

export default function App() {
  //const [player, setPlayer] = useState<YouTubePlayerT | undefined>(undefined);
  //const [game, setGame] = useState<GameAbbreviation>('acnh');
  const [now, setNow] = useState(new Date());
  //const hour = now.getHours();
  
  //useEffect(() => {
  //  console.log('hour changed to', hour);
  //}, [hour]);

  //const updateTrack = useCallback(() => {
  //  console.log('update track called')
  //  if (player) {
  //    const trackId = tracks[game][hour];
  //    player.loadVideoById(trackId)
  //    player.playVideo();
  //  }
  //}, [player, game, hour])

  useEffect(() => {
    const i = setInterval(() => {
      setNow(new Date());
    }, 500);

    return () => clearInterval(i);
  }, []);

  const pages = useMemo<ProjectApp[][]>(() => {
    // https://stackoverflow.com/a/11318797
    const apps_ = [
      ...metaApps,
      ...apps,
    ];
    const result: ProjectApp[][] = [];
    while (apps_.length > 0) {
      result.push(apps_.splice(0, 9));
    }
    return result;
  }, []);

  const queryAppId = new URLSearchParams(window.location.search).get('app');

  const [page, setPage] = useState(0);
  const [hoveredApp, setHoveredApp_] = useState<ProjectApp | undefined>(pages[page][0]);
  const [selectedApp, setSelectedApp_] = useState<ProjectApp | undefined>(
    (queryAppId || window.innerWidth >= 640)
      ? [...metaApps, ...apps].find((a) => a.id === Number.parseInt(queryAppId ?? '0'))
      : undefined
  );
  const [matrixPos, setMatrixPos_] = useState<[number, number]>([0, 0]);

  const setHoveredApp = useCallback(
    (value: ProjectApp | undefined) => {
      if (value) {
        const pageWithApp = pages.find((p) => p.map((a) => a.id).includes(value.id))
        if (pageWithApp) {
          const index = pages.indexOf(pageWithApp)
          setPage(index);
          scrollToPage(index);
        };
      }
      setHoveredApp_(value);
    },
    [pages]
  );

  const setSelectedApp = useCallback(
    (value: ProjectApp | undefined) => {
      setSelectedApp_(undefined); // Trigger closing animation regardless of new value
      setTimeout(() => setSelectedApp_(value), 50);
    },
    []
  );

  const setMatrixPos = useCallback(
    (value: [number, number]) => {
      const [ row, col ] = value;
      if (row >= 0 && row < 3 && col >= 0 && col < 3) {
        setMatrixPos_(value);
      }
    },
    []
  );

  // Navigate phone UI with arrow keys + enter
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const [ row, column ] = matrixPos;

      const getAppAt = (r: number, c: number, pageIndex?: number) => {
        const app = pages[pageIndex ?? page][(Math.max(r, 0) * 3) + Math.max(c, 0)]
        console.log(r, c, app?.id);
        return app;
      }

      const code = e.code;
      console.log('current', row, column, code);
      switch (code) {
        case 'KeyW':
        case 'ArrowUp': {
          const app = getAppAt(row - 1, column);
          if (app) {
            setHoveredApp(app);
            setMatrixPos([row - 1, column]);
          }
          break;
        }
        case 'KeyS':
        case 'ArrowDown': {
          const app = getAppAt(row + 1, column);
          if (app) {
            setHoveredApp(app);
            setMatrixPos([row + 1, column]);
          }
          break;
        }
        case 'KeyA':
        case 'ArrowLeft':
          if (column === 0 && page > 0) {
            const app = getAppAt(0, 2, page - 1);
            if (app) {
              setHoveredApp(app);
              setMatrixPos([0, 2]);
            }
          } else {
            const app = getAppAt(row, column - 1);
            if (app) {
              setHoveredApp(app);
              setMatrixPos([row, column - 1]);
            }
          }
          break;
        case 'KeyD':
        case 'ArrowRight':
          if (column === 2 && page < pages.length - 1) {
            const app = getAppAt(0, 0, page + 1);
            if (app) {
              setHoveredApp(app);
              setMatrixPos([0, 0]);
            }
          } else {
            const app = getAppAt(row, column + 1);
            if (app) {
              setHoveredApp(app);
              setMatrixPos([row, column + 1]);
            }
          }
          break;
        case 'Space':
        case 'Enter':
          if (selectedApp?.id === hoveredApp?.id) setSelectedApp(undefined);
          else setSelectedApp(hoveredApp);
          break;
        case 'Escape':
          setSelectedApp(undefined);
          break;
        default:
          break;
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [page, pages, hoveredApp, setHoveredApp, selectedApp, setSelectedApp, matrixPos, setMatrixPos])

  const scrollToPage = (num: number) => {
    const element = document.querySelector(`#page-${num}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // https://github.com/gajus/youtube-player/issues/99
  //useEffect(() => {
  //  console.log('effect called');
  //  if (player) {
  //    updateTrack();
  //    return;
  //  }

  //  const trackId = tracks[game][hour];
  //  console.log('new track id', trackId);

  //  //const ytPlayer = YouTubePlayer('player', {
  //  //  videoId: trackId,
  //  //  playerVars: {
  //  //    loop: 1,
  //  //    playlist: trackId,  // https://stackoverflow.com/a/25781957
  //  //  },
  //  //});
  //  const ytPlayer = YouTubePlayer('player');

  //  ytPlayer.loadVideoById(trackId);
  //  ytPlayer.playVideo().then(() => console.log('loaded & started video', trackId));

  //  const restartVideo = () => {
  //    ytPlayer.seekTo(0, true).then(() => console.log('seek to finished'));
  //    ytPlayer.playVideo().then(() => console.log('play video finished'));
  //  }

  //  ytPlayer.on('error', console.log);

  //  ytPlayer.on('stateChange', (e) => {
  //    console.log('state', e);
  //    if (e.data === PlayerStates.ENDED) {
  //      restartVideo();
  //    }
  //  });

  //  setPlayer(ytPlayer);
  //}, [hour, game, player, updateTrack])

  return (
    <div className='bg-ac-beige h-screen pt-8 sm:bg-inherit sm:p-12 sm:flex'>
      <div className='absolute -top-5 -left-5 w-0 h-0' id='player' />
      <div className='w-80 m-auto sm:mx-0 sm:w-72 sm:min-w-[18rem] rounded-[3.5rem] bg-ac-beige select-none px-8 pt-7 pb-12 h-fit'>
        <div className='flex text-ac-beige-dark'>
          <div className='grid grid-cols-3 grid-rows-3 mr-auto'>
            <div /><div /><SignalHump />
            <div /><SignalHump /><SignalHump />
            <SignalHump /><SignalHump /><SignalHump />
          </div>
          {/* Cat icon */}
          <p className='mx-auto font-semibold tracking-wider'>{now.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}</p>
          <div className='ml-auto w-4'></div>
        </div>
        <div className='my-4 font-bold text-center text-2xl'>
          {hoveredApp?.name ?? 'Shay Phone'}
        </div>
        <div className='overflow-x-hidden flex max-w-[20rem] sm:max-w-[18rem]'>
          {pages.map((p, i) => {
            return (
              <div
                key={i}
                id={`page-${i}`}
                className='min-w-[14rem]'
              >
                <div className='grid grid-cols-3 grid-rows-3 gap-4 my-2 mx-4'>
                  {p.map((app) => {
                    return (
                      <AppIcon
                        key={app.id}
                        app={app}
                        hoverState={[hoveredApp, setHoveredApp]}
                        selectState={[selectedApp, setSelectedApp]}
                      />
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
        {pages.length > 1 && (
          <div className='mt-6 -mb-4 w-full flex'>
            <div className='mx-auto flex space-x-2'>
              {pages.map((_, i) => (
                <button
                  key={`page-${i}`}
                  onClick={() => {
                    scrollToPage(i);
                    setHoveredApp(pages[i][0]);
                  }}
                  className={`rounded-full bg-ac-beige-dark w-2 h-2 transition-all outline ${page === i ? 'outline-4 outline-offset-1 outline-teal-500' : 'outline-transparent'}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className={`absolute top-0 left-0 sm:relative sm:ml-12 bg-ac-beige h-full w-full sm:w-auto sm:grow ${selectedApp ? 'scale-100 rounded-[3.5rem] brightness-100' : 'scale-0 rounded-[8rem] brightness-90'} transition-all`}>
        <div className='relative h-full'>
          {selectedApp && (
            <div className='p-12 overflow-y-auto overflow-x-hidden'>
              <div className='flex'>
                <div>
                  <p className='font-black text-4xl'>
                    {selectedApp.name}
                  </p>
                  {selectedApp.createdAt && (
                    <div
                      className='opacity-80 text-xl font-bold'
                      title={`First released ${selectedApp.createdAt.toLocaleDateString()}`}
                    >
                      {selectedApp.defunctAt
                        ? <>{selectedApp.createdAt.getFullYear()} &#x2014; {selectedApp.defunctAt.getFullYear()}</>
                        : <>Od {selectedApp.createdAt.getFullYear()}</>}
                      {selectedApp.type && typeSvgs[selectedApp.type] && (
                        <>
                          {' '}na
                          {' '}<img src={typeSvgs[selectedApp.type]} className='w-6 h-6 inline' alt={selectedApp.type} />
                          {' '}<span className='capitalize'>{selectedApp.type}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <img
                  className='rounded-3xl w-16 h-16 ml-auto sm:hidden md:block'
                  src={selectedApp.image}
                  alt={selectedApp.name}
                />
              </div>
              <hr className='my-4 border border-ac-beige-dark' />
              <p>{selectedApp.summary}</p>
              {selectedApp.links && (
                <>
                  <hr className='my-4 border border-ac-beige-dark' />
                  <p className='font-black text-2xl'>Linki</p>
                  <ul>
                    {[
                      ...selectedApp.links,
                      { name: 'Donate', url: 'https://www.paypal.com/paypalme/igorekowo7' },
                    ].map((link) => {
                      return (
                        <li key={link.url}>
                          <a
                            href={link.url}
                            className={`text-teal-600 group`}
                          >
                            &#x1f517;{' '}
                            <span className={`group-hover:italic group-hover:after:content-['_~'] group-hover:before:content-['~_']`}>
                              {link.name ?? 'Check it out!'}
                            </span>
                          </a>
                        </li>
                      )
                    })}
                  </ul>
                </>
              )}
            </div>
          )}
          <div className='absolute bottom-0 flex w-full p-8 bg-ac-beige-dark/10 border-t-2 border-t-ac-beige-dark rounded-b-[3.5rem]'>
            <button
              className='rounded-full flex mx-auto border-2 border-t-4 hover:bg-ac-beige-dark/30 transition-colors border-ac-beige-dark w-12 h-12'
              onClick={() => setSelectedApp(undefined)}
              title='Zamknij aplikacje'
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const SignalHump = () => (
  <div className='w-3 h-2 ml-0.5 mb-0.5 relative'>
    <div className='absolute bg-ac-beige w-full h-2 -bottom-[5px] left-0' />
    <div className='border-4 border-ac-beige-dark rounded-full h-3 w-3' />
  </div>
)

const AppIcon = (
  {
    app,
    hoverState,
    selectState,
  }: {
    app: ProjectApp,
    hoverState: [ProjectApp | undefined, (value: ProjectApp | undefined) => void],
    selectState: [ProjectApp | undefined, (value: ProjectApp | undefined) => void],
  }
) => {
  const [hoveredApp, setHoveredApp] = hoverState;
  const [selectedApp, setSelectedApp] = selectState;

  return (
    <button
      className={`block h-auto rounded-3xl transition-all outline outline-2 outline-offset-[1.5px] cursor-ac ${selectedApp?.id === app.id ? 'scale-110 outline-teal-500' : hoveredApp?.id === app.id ? 'scale-110 outline-teal-500' : 'outline-transparent'}`}
      onMouseOver={() => setHoveredApp(app)}
      onFocus={() => setHoveredApp(app)}
      onClick={() => selectedApp?.id === app.id ? setSelectedApp(undefined) : setSelectedApp(app)}
      // Prevent accessibility features from doubling the custom Space/Enter handler we have above
      // It might be preferable to navigate the grid with accessibility shortcuts instead of using a custom implementation
      onKeyDown={(e) => e.preventDefault()}
    >
      <img
        className='rounded-3xl aspect-square'
        src={app.image}
        alt={app.name}
      />
    </button>
  );
}
