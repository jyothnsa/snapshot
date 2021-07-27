import { useI18n } from 'vue-i18n';
import { useCopy } from '@/composables/useCopy';
import { useShare } from '@vueuse/core';

export function useSharing() {
  const { t } = useI18n();

  const sharingItems = [
    {
      text: 'Twitter',
      action: 'shareToTwitter',
      icon: 'twitter'
    },
    {
      text: 'Facebook',
      action: 'shareToFacebook',
      icon: 'facebook'
    },
    {
      text: t('copyLink'),
      action: 'shareToClipboard',
      icon: 'insertlink'
    }
  ];

  function proposalUrl(key, proposal) {
    return `https://${window.location.hostname}/#/${key}/proposal/${proposal.id}`;
  }
  function encodedProposalUrl(key, proposal) {
    return encodeURIComponent(proposalUrl(key, proposal));
  }

  const { share, isSupported } = useShare();

  function startShare(space, proposal) {
    share({
      title: proposal.title,
      text: `${space.twitter || space.name}`,
      url: proposalUrl(space.key, proposal)
    });
  }

  function shareToTwitter(space, proposal, window) {
    if (isSupported) startShare(space, proposal);
    else {
      const url = `https://twitter.com/intent/tweet?text=@${
        space.twitter || space.name
      }%20${encodeURIComponent(proposal.title)}%20${encodedProposalUrl(
        space.key,
        proposal
      )}`;
      window.open(url, '_blank').focus();
    }
  }

  function shareToFacebook(space, proposal, window) {
    if (isSupported) startShare(space, proposal);
    else {
      const url = `https://www.facebook.com/sharer/sharer.php?u=${encodedProposalUrl(
        space.key,
        proposal
      )}&quote=${encodeURIComponent(proposal.title)}`;
      window.open(url, '_blank').focus();
    }
  }

  const { copyToClipboard } = useCopy();

  function shareToClipboard(space, proposal) {
    copyToClipboard(proposalUrl(space.key, proposal));
  }

  return {
    shareToTwitter,
    shareToFacebook,
    shareToClipboard,
    proposalUrl,
    sharingItems
  };
}
