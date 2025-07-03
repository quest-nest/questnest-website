import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const About: React.FC = () => {
  const basePath = import.meta.env.BASE_URL;
  
  return (
    <main className="about-page">
      {/* Hero Section with Quote */}
      <section className="about-hero">
        <div className="about-hero-container">
          <h1 className="about-hero-title">Our Backstory</h1>
          <blockquote className="about-quote">
            <p>"I'm the founder of Quest Nest. I wish everyone playing this wonderful game to have fun, enjoy themselves and have an amazing experience!"</p>
            <cite>Frank Symons</cite>
          </blockquote>
        </div>
      </section>

      {/* Frank's Story Section */}
      <section className="about-story">
        <div className="about-story-container">
          <div className="story-content">
            <div className="story-image">
              <img 
                src={`${basePath}images/frank_about_us.webp`} 
                alt="Frank Symons - Founder of Quest Nest"
                className="founder-image"
              />
            </div>
            <div className="story-text">
              <h2 className="story-title">Multiclassed in Life</h2>
              <ul className="character-stats">
                <li>Race: Humanoid(-ish)</li>
                <li>Class: Paladin Ranger</li>
                <li>Background is straight-up bonkers.</li>
              </ul>
              
              <h3>Don't believe me? Read this:</h3>
              <p>
                I grew up in an entrepreneurial family, wanted to join the military so worked out, 
                met a girl, decided to do business instead. Did a sports study 50/50 sports and study. 
                Then did corporate work in sales in Dubai, started a football school in China, helped 
                an American company in the back-end with a company for the Olympic Games Rio 2020, 
                continued sales in the Netherlands before I trained writing as a 
                Bidmanager/Tendermanager.
              </p>
              
              <h3>Fast Forward 4 Years</h3>
              <p>
                Realised I was more of a "good" guy than a corporate person and apparently a nerd 
                that just never joined the band. I founded Quest Nest, love what I do and I am 
                starting to realise that there are heaps of likeminded people out there. So I'm 
                exploring a whole new world of awesome with collaborators, passionates, conventions, 
                products, events and more!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quest Nest Origin Section */}
      <section className="quest-nest-origin">
        <div className="origin-container">
          <h2 className="origin-title">How that lead to Quest Nest</h2>
          <div className="origin-content">
            <p>
              I started as a GM using the guidance of an adventure module. Quickly, I realised 
              I needed more time to give my players the quality story they deserve.
            </p>
            <p>
              Finding PC backstory connections, setting up guilds, figure out the deities, what 
              monsters lived there, the dominant races and the different local governing bodies. 
              Therefore, I decided I might as well homebrew the entire adventure and started to 
              think about my players.
            </p>
            <p>
              How would I get my new players to learn about these deities and guilds? How would 
              I get them thinking about the worlds' history, or talk about wars that happened 
              3,000 years ago? Before you know it, you're just building and planning for months, 
              then years.
            </p>
            <p>
              It just made sense for me to share the knowledge of that world, add artwork, rework 
              my notes so others could understand them and let others enjoy the game without the 
              countless hours of preparation.
            </p>
            <p>
              Therefore I came up with the term "GM-Friendly Adventures", which gives the GM 
              everything they need to play the game, but doesn't take away room for homebrew or 
              player advocacy. My players are still playing in the game and the world is still expanding!
            </p>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="vision-section">
        <div className="vision-container">
          <div className="vision-content">
            <div className="vision-text">
              <h2 className="vision-title">Continues to dream</h2>
              <p>
                A nest can be warm, cozy, fuzzy and comfortable. A place where others feel at home. 
                In other words a safe place, where you can be yourself and share stories over a bowl 
                of food next to a fire. Learn from each other to be a better you. However a nest can 
                also be dangerous, something to avoid, tricky, but yet rewarding. We hope with Quest 
                Nest to provide both, for a GM to grow you'll need to (occasionally) get into your 
                growth zone and out of your comfort zone.
              </p>
              <p>
                Myself, I love relaxing with friends or family, great food (maybe some rum) and 
                watching a movie or reading a book, before I know it; I'm making notes and imagine 
                the world of the Ketza Kingdom expand. Currently the time for those relaxing moments 
                have shortened, since I became a dad. Proud that I've gotten this far! Still dreaming 
                so much further...
              </p>
              <Link to="/contact" className="collaborate-btn">
                Curious to collaborate?
              </Link>
            </div>
            <div className="vision-image">
              <img 
                src={`${basePath}images/CharlieStranger.webp`} 
                alt="Quest Nest Adventure Art"
                className="adventure-image"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
