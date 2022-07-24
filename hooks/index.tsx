import Caver, { Contract } from "caver-js";
import { MINT_NFT_ABI, MINT_NFT_ADDRESS, DGR_TOKEN_ABI, DGR_TOKEN_ADDRESS } from "caverConfig";
import { useEffect, useRef, useState } from "react";

export const useAccount = () => {
  const [account, setAccount] = useState<string>("");

  const getAccount = async () => {
    try {
      const accounts = await window.klaytn.enable();

      setAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (window.klaytn) {
      getAccount();
    }
  }, []);

  return { account };
};

export const useCaver = () => {
  const [caver, setCaver] = useState<Caver | undefined>(undefined);
  const [mintNFTContract, setmintNFTContract] = useState<Contract | undefined>(
    undefined
  );
  const [dgrTokenContract, setDGRTokenContract] = useState<Contract | undefined>(
    undefined
  );

  useEffect(() => {
    if (window.klaytn) {
      setCaver(new Caver(window.klaytn));
    }
  }, []);

  useEffect(() => {
    if (!caver) return;

    setmintNFTContract(caver.contract.create(MINT_NFT_ABI, MINT_NFT_ADDRESS));

    setDGRTokenContract(caver.contract.create(DGR_TOKEN_ABI, DGR_TOKEN_ADDRESS));
  }, [caver]);

  return { caver, mintNFTContract, dgrTokenContract };
};

export const useAnimate = () => {
  const [isAnimated, setIsAnimated] = useState<boolean>(false);

  const dom = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const observe = () => {
      if (dom.current) {
        observer.current = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) setIsAnimated(true);
          else setIsAnimated(false);
        });
        observer.current.observe(dom.current);

        return () => observer.current && observer.current.disconnect;
      }
    };

    observe();
  }, [dom]);

  return { isAnimated, dom };
};
