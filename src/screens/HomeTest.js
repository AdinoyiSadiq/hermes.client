import React, { Component } from 'react';
import profile__icon from '../images/profile-icon.svg';
import contacts__icon from '../images/contactList-icon.svg';
import search__icon from '../images/search-icon.svg';
import search__icon__orange from '../images/search-icon--orange.svg';
import user__avatar from '../images/user-avatar.svg';
import user__avatar__large from '../images/user-avatar--large.svg';
import image__upload__icon from '../images/image-upload-icon.svg';
import message__send__icon from '../images/message-send-icon.svg';
import emoji__icon from '../images/emoji-icon.svg';
import reply__icon from '../images/reply-icon.svg';
import close__icon from '../images/close-icon.svg';
import message__status from '../images/message-status.svg';
import shared__image__1 from '../images/shared-image-1.svg';
import shared__image__2 from '../images/shared-image-2.svg';
import shared__image__3 from '../images/shared-image-3.svg';

class Home extends Component {
  render() {
    return (
      <div className='home'>
        <div className='chat-list'>
          <section className='header'>
            <div className='header__title'>Active Chats</div>
            <div>
              <div className='nav-button'>
                <img src={contacts__icon} alt='contacts'/>
              </div>
              <div className='nav-button'>
                <img src={profile__icon} alt='profile'/>
              </div>
            </div>
          </section>
          <section className='search u-margin-top-2'>
            <label  htmlFor='search' className='search__button'>
              <img className='search__botton--icon' src={search__icon} alt='search icon'/>
            </label>
            <input className='form__input search__box' type='text' placeholder='Search...' name='search' id='search' />
          </section>
          <section className='user-list'>
            <div className='user u-margin-top-2'>
              <img className='user__avatar' src={user__avatar} alt='user avatar' />
              <div className='user__details'>
                <div>
                  <div className='user__details--name'>Priscilla Black</div>
                  <div className='user__details--message'>This was meant to be the la...</div>
                </div>
                <div>
                  <div className='user__details--number'>12</div>
                  <div className='user__details--time'>12:03PM</div>
                </div>
              </div>
            </div>
            <div className='user u-margin-top-2'>
              <img className='user__avatar' src={user__avatar} alt='user avatar' />
              <div className='user__details'>
                <div>
                  <div className='user__details--name'>Priscilla Black</div>
                  <div className='user__details--message'>This was meant to be the la...</div>
                </div>
                <div>
                  <div className='user__details--number'>12</div>
                  <div className='user__details--time'>12:03PM</div>
                </div>
              </div>
            </div>
            <div className='user u-margin-top-2'>
              <img className='user__avatar' src={user__avatar} alt='user avatar' />
              <div className='user__details'>
                <div>
                  <div className='user__details--name'>Priscilla Black</div>
                  <div className='user__details--message'>This was meant to be the la...</div>
                </div>
                <div>
                  <div className='user__details--number'>12</div>
                  <div className='user__details--time'>12:03PM</div>
                </div>
              </div>
            </div>
            <div className='user u-margin-top-2'>
              <img className='user__avatar' src={user__avatar} alt='user avatar' />
              <div className='user__details'>
                <div>
                  <div className='user__details--name'>Priscilla Black</div>
                  <div className='user__details--message'>This was meant to be the la...</div>
                </div>
                <div>
                  <div className='user__details--number'>12</div>
                  <div className='user__details--time'>12:03PM</div>
                </div>
              </div>
            </div>
            <div className='user u-margin-top-2'>
              <img className='user__avatar' src={user__avatar} alt='user avatar' />
              <div className='user__details'>
                <div>
                  <div className='user__details--name'>Priscilla Black</div>
                  <div className='user__details--message'>This was meant to be the la...</div>
                </div>
                <div>
                  <div className='user__details--number'>12</div>
                  <div className='user__details--time'>12:03PM</div>
                </div>
              </div>
            </div>
            <div className='user u-margin-top-2'>
              <img className='user__avatar' src={user__avatar} alt='user avatar' />
              <div className='user__details'>
                <div>
                  <div className='user__details--name'>Priscilla Black</div>
                  <div className='user__details--message'>This was meant to be the la...</div>
                </div>
                <div>
                  <div className='user__details--number'>12</div>
                  <div className='user__details--time'>12:03PM</div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className='messaging'>
          <section className='header'>
            <div className='user__details'>
              <img className='user__details--avatar' src={user__avatar} alt='user avatar' />
              <div className='user__details--name'>Priscilla Black</div>
            </div>
            <div className='nav-button'>
              <img src={search__icon__orange} alt='search'/>
            </div>
          </section>
          <section className='messages'>
            <div className='message__sent'>
              <div>
                <div className='message__content'>
                  This is the best conversation we have at the moment
                </div>
                <div className='message__details'>
                  <div className='message__details--time'>12:11PM</div>
                  <div className='message__details--status'>
                    <img src={message__status} alt="message status indicator" />
                    <img src={message__status} alt="message status indicator" />
                  </div>
                </div>
              </div>
            </div>
            <div className='message__received'>
              <div>
                <div className='message__content'>
                  Yeah, but it depends though
                </div>
                <div className='message__details'>
                  <div className='message__details--time'>12:11PM</div>
                </div>
              </div>
            </div>
            <div className='message__received'>
              <div>
                <div className='message__content'>
                  <div className='message__content--quote'>
                    How about we rethink the synergistically underwhelm exceptional applications?
                  </div>
                  Yeah, but it depends though
                </div>
                <div className='message__details'>
                  <div className='message__details--time'>12:11PM</div>
                </div>
              </div>
            </div>
          </section>
          <section className='message-input'>
            <div className='message-input__reply u-margin-top-1 u-margin-bottom-1'>
              <div className='message-input__reply--container'>
                <div className='message-input__reply--details'>
                  <img src={reply__icon} alt='contacts'/>
                  <div className='message-input__reply--name'>Priscilla Black</div>
                </div>
                <div className='message-input__reply--quote'>Yeah, but it depends though</div>
              </div>
              <div className='nav-button'>
                <img src={close__icon} alt='contacts'/>
              </div>
            </div>

            <div className='message-input__container'>
              <div className='nav-button'>
                <img src={image__upload__icon} alt='contacts'/>
              </div>
              <input className='form__input' type='text' placeholder='Message...' name='message' id='message' />
              <div className='nav-button__container'>
                <div className='nav-button'>
                  <img src={emoji__icon} alt='contacts'/>
                </div>
              </div>
              <div className='nav-button message-input__send'>
                <img src={message__send__icon} alt='contacts'/>
              </div>
            </div>
          </section>
        </div>
        <div className='contact-profile'>
          <div className='contact-profile__image'>
            <img className='user__avatar' src={user__avatar__large} alt='user avatar' />
          </div>
          <div className='contact-profile__name u-margin-top-3 u-margin-bottom-3'>
            <div className='contact-profile__name--username'>Priscilla Black</div>
            <div className='contact-profile__name--userhandle'>@piscy_blck</div>
          </div>
          
          <div className='contact-profile__details'>
            <div className='contact-profile__details--label'>Email Address</div>
            <div className='contact-profile__details--content'>priscillablack@mailer.com</div>
          </div>
          <div className='contact-profile__details'>
            <div className='contact-profile__details--label'>Location</div>
            <div className='contact-profile__details--content'>Kaduna, Nigeria</div>
          </div>
          <div className='contact-profile__media'>
            <div className='contact-profile__media--label'>Shared Media</div>
            <div className='contact-profile__media--content'>
              <img className='shared__media' src={shared__image__1} alt='user avatar' />
              <img className='shared__media' src={shared__image__2} alt='user avatar' />
              <img className='shared__media' src={shared__image__3} alt='user avatar' />
            </div>
          </div>
          <div className='contact-profile__language'>
            <div>
              <div>
                <div className='contact-profile__language--label'>Language preference</div>
                <div className='contact-profile__language--content'>French</div>
              </div>
              <div className='contact-profile__language--container'>
                <div className='contact-profile__language--button'>Edit</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
