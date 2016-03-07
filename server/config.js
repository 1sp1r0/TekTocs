export default {
    slideshowRequiresTitle:`Every slideshow needs a title. 
          Enter the title after the command - "/tektocs-startlive titleOfYourSlideshow"`,
   // noUnpublishedSlideshowsFound:
   // (...values)=>`Could not find any unpublished slideshows for:${values[0]},${values[1]}` 
   noUnpublishedSlideshowsFound:`Could not find any unpublished slideshows.`,
  slideshowHasBeenPublished: `Slideshow has been published.`,
  couldNotretrieveSlackmessage: `Could not retrieve messages from the Slack channel.`,
  didNotFindrecord:`Models.SlackTeam.findOne did not find a record`,
  somethingDoesntSeemToBeRight:`Hmm, something doesn't seem to be right. We are looking into this.`,
  unauthorizedSlashCommandAccess:`Unauthorized slash command access`,
  couldNotProcessMessageAsSlide:`Could not process message as slide.`,
  slideshowMarkedAsComplete:`Your slideshow is now marked as complete. The next step is to publish it using the command /tektocs-publish.`,
  couldNotRetriveUserInfo:`Could not retrieve user info.`,
  letsGetStartedWithTheSlideshow:`Hey there! Let's get started with your slideshow. Every message you post in this channel will be a single slide. To end the slideshow, use the slash command /tektocs-end. To publish the slideshow use the command /tektocs-publish.`,
  letsGetStartedWithTheLiveSlideshow:`Hey there! Let\'s get started with your slideshow. Every message you post in this channel will be a single slide.`,
  readyToAddSlides:`You are now ready to add slides to your slideshow. First, change over to our bot, Tektocs', direct messaging channel. Every message you post in that channel will be a single slide.  Happy creating!`,
  troubleWakingUpBot:`Sorry, we had trouble waking up our bot, Tektocs.`,
  couldNotOpenDMChannelWithBot:`Could not open direct message channel with our bot, Tektocs.`
  };