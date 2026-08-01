'use client';

import React from 'react';
import { UIMessage } from 'ai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, User } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface ChatMessageProps {
  message: UIMessage;
}

const MotionDiv = motion.div as any;

const getMessageText = (msg: UIMessage) => {
  if ((msg as any).content) return (msg as any).content;
  if (!msg.parts) return '';
  return msg.parts
    .filter((part: any) => part.type === 'text')
    .map((part: any) => part.text)
    .join('');
};

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const text = getMessageText(message);

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        'flex w-full mb-4 md:mb-6 gap-2 md:gap-4',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <div className="hidden sm:flex w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-600/10 border border-blue-200 dark:border-blue-800 items-center justify-center shrink-0">
          <Bot className="w-4 h-4 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
        </div>
      )}
      
      <div
        className={clsx(
          'max-w-[90%] sm:max-w-[80%] px-4 py-3 md:px-6 md:py-4 rounded-2xl md:rounded-3xl backdrop-blur-md',
          isUser
            ? 'bg-blue-600 text-white rounded-tr-sm shadow-sm'
            : 'bg-white/70 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700/50 text-zinc-900 dark:text-zinc-100 rounded-tl-sm shadow-sm'
        )}
      >
        {isUser ? (
          <div className="whitespace-pre-wrap text-sm md:text-base">{text}</div>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-a:text-blue-600 prose-strong:text-blue-700 dark:prose-strong:text-blue-400">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {text}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {isUser && (
        <div className="hidden sm:flex w-8 h-8 md:w-10 md:h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 items-center justify-center shrink-0 overflow-hidden">
          <User className="w-4 h-4 md:w-6 md:h-6 text-zinc-500 dark:text-zinc-400" />
        </div>
      )}
    </MotionDiv>
  );
}
